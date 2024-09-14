import {
  StyleSheet,
  TextInput,
  Alert,
  View,
  Image,
  FlatList,
} from "react-native";
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
import { createAttachment } from "../../src/graphql/mutations";
const InputBox = ({ chatroom }) => {
  const insets = useSafeAreaInsets();
  const [newMessage, setNewMessage] = useState("");
  const [files, setFiles] = useState([]);

  const onSend = async () => {
    const authUser = await Auth.currentAuthenticatedUser();
    const messageBody = {
      chatroomID: chatroom.id,
      text: newMessage,
      userID: authUser.attributes.sub,
    };

    // if (images.length > 0) {
    //   messageBody.images = await Promise.all(images.map(uploadFile));
    //   setImage(null);
    // }

    const createdMessage = await API.graphql(
      graphqlOperation(createMessage, { input: messageBody }),
    );

    setNewMessage(null);
    console.log(createdMessage);
    await Promise.all(
      files.map((image) =>
        addAttachment(image, createdMessage?.data?.createMessage?.id),
      ),
    );
    setFiles(null);
    await API.graphql(
      graphqlOperation(updateChatRoom, {
        input: {
          id: chatroom?.id,
          //@ts-ignore
          chatRoomLastMessagesId: createdMessage?.data?.createMessage?.id,
        },
      }),
    );
  };

  const addAttachment = async (file, messageID) => {
    const types = {
      image: "IMAGE",
      video: "VIDEO",
    };

    const newAttachment = {
      storageKey: await uploadFile(file),
      type: types[file.type],
      width: file.width,
      height: file.height,
      duration: file.duration,
      messageID,
      chatroomID: chatroom.id,
    };
    return API.graphql(
      graphqlOperation(createAttachment, { input: newAttachment }),
    );
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });
    //@ts-ignore
    if (!result?.cancelled) {
      //@ts-ignore
      setFiles(result.assets);
    }
  };

  const uploadFile = async (fileUri) => {
    try {
      const response = await fetch(fileUri.uri);
      const blob = await response.blob();
      const key = `${uuidv4()}.${fileUri.fileName?.split(".")[1]}`;
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
      {files?.length > 0 && (
        <View style={styleSheet.attachmentsContainer}>
          <FlatList
            keyExtractor={({ item }) => item?.fileName}
            horizontal
            data={files}
            renderItem={({ item }) => (
              <>
                <Image
                  source={{ uri: item.uri }}
                  style={styleSheet.selectedImage}
                  resizeMode="contain"
                />
                <MaterialIcons
                  name="highlight-remove"
                  onPress={() =>
                    setFiles((images) =>
                      images.filter(
                        (image) => item.fileName !== image.fileName,
                      ),
                    )
                  }
                  size={20}
                  color="gray"
                  style={styleSheet.removeSelectedImage}
                />
              </>
            )}
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
