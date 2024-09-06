import { View, StyleSheet, TextInput, Alert } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

const InputBox = () => {
  const [newMessage, setNewMessage] = useState("");

  const onSend = () => {
    console.log("send New message", newMessage);
    Alert.alert("send New message", newMessage);

    setNewMessage("");
  };
  return (
    <View className="flex-row items-center bg-white/70 p-1.5">
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
