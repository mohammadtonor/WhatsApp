import { Image, Text, View } from "react-native";

const ChatListItem = () => {
  return (
    <View className="flex-row mx-2 my-2 space-x-2 items-center justify-center">
      <View className={"relative w-16 h-16"}>
        <Image
          source={{
            uri: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/lukas.jpeg",
          }}
          className={"w-full h-full rounded-full"}
          resizeMode={"contain"}
        />
      </View>
      <View className="flex-1 h-full border-b border-gray-100">
        <View className={"flex-row items-center justify-between "}>
          <Text className={"font-bold "}>Lukas</Text>
          <Text className={"font-bold text-gray-500"}>7:08</Text>
        </View>
        <Text className={""}>Hello World!</Text>
      </View>
    </View>
  );
};
export default ChatListItem;
