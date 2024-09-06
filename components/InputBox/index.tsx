import { StyleSheet, TextInput, Alert, View } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const InputBox = () => {
  const insets = useSafeAreaInsets();
  const [newMessage, setNewMessage] = useState("");

  const onSend = () => {
    console.log("send New message", newMessage);
    Alert.alert("send New message", newMessage);

    setNewMessage("");
  };
  return (
    <View
      style={{
        paddingBottom: insets.top - 5,
      }}
      className="flex-row items-center bg-white/70 px-2 pt-1"
    >
      <AntDesign name="plus" size={24} color="royalblue" />
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
  );
};

const styleSheet = StyleSheet.create({
  send: {
    backgroundColor: "royalblue",

    padding: 7,
    borderRadius: 50,
    overflow: "hidden",
  },
});

export default InputBox;
