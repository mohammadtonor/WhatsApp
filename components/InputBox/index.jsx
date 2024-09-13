import { StyleSheet, TextInput, Alert, View, Image } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { API, Auth, graphqlOperation, Storage } from "aws-amplify";
import { createMessage, updateChatRoom } from "../../graphql/mutations";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
const InputBox = ({ chatroom }) => {
  const insets = useSafeAreaInsets();
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState(null);

  const onSend = async () => {
    const authUser = await Auth.currentAuthenticatedUser();
    const messageBody = {
      chatroomID: chatroom.id,
      text: newMessage,
      userID: authUser.attributes.sub,
    };

    if (image) {
      messageBody.images = await uploadFile(image);
      setImage(null);
    }
    const createdMessage = await API.graphql(
      graphqlOperation(createMessage, { input: messageBody }),
    );

    await API.graphql(
      graphqlOperation(updateChatRoom, {
        input: {
          id: chatroom?.id,
          //@ts-ignore
          chatRoomLastMessagesId: createdMessage?.data?.createMessage?.id,
        },
      }),
    );

    setNewMessage(null);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    //@ts-ignore
    if (!result?.cancelled) {
      //@ts-ignore
      setImage(result.assets[0]);
    }
  };
  const uploadFile = async (fileUri) => {
    try {
      const response = await fetch(fileUri.uri);
      const blob = await response.blob();
      const key = `${uuidv4()}.${fileUri.fileName?.split(".")[1]}`;
      console.log(key);
      await Storage.put(key, blob, {
        contentType: `${fileUri.mimeType}`, // contentType is optional
      });
      return key;
    } catch (err) {
      console.log("Error uploading file:", err);
    }
  };
  return (
    <>
      {image && (
        <View style={styleSheet.attachmentsContainer}>
          <Image
            source={{ uri: image?.uri }}
            style={styleSheet.selectedImage}
            resizeMode="contain"
          />
          <MaterialIcons
            name="highlight-remove"
            onPress={() => setImage(null)}
            size={20}
            color="gray"
            style={styleSheet.removeSelectedImage}
          />
        </View>
      )}
      <View
        style={{
          paddingBottom: insets.top - 20,
        }}
        className="flex-row items-center bg-white/70 px-2 pt-1"
      >
        <AntDesign
          name="plus"
          size={24}
          color="royalblue"
          onPress={() => pickImage()}
        />
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          className="text-[18px] flex-1 p-2 px-3 mx-3 rounded-full bg-white"
        />
        <MaterialIcons
          onPress={onSend}
          style={styleSheet.send}
          name="send"
          size={24}
          color="white"
        />
      </View>
    </>
  );
};

const styleSheet = StyleSheet.create({
  send: {
    backgroundColor: "royalblue",
    padding: 7,
    borderRadius: 50,
    overflow: "hidden",
  },
  attachmentsContainer: {
    alignItems: "flex-end",
  },
  selectedImage: {
    height: 100,
    width: 200,
    margin: 5,
  },
  removeSelectedImage: {
    position: "absolute",
    right: 10,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default InputBox;
