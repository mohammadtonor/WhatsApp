import { Image, Text, TouchableOpacity, View } from "react-native";
import { ChatItemProps } from "@/types/type";
import { router } from "expo-router";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);

const ChatListItem = ({ chat }: ChatItemProps) => {
  const [date, time] = chat.lastMessage.createdAt.split("T");

  return (
    <TouchableOpacity
      onPress={() => router.navigate(`/(root)/chat/${chat.id}`)}
      className={
        "flex-row mx-2 my-1 p-1 space-x-2 items-center justify-center border-b pb-2 border-gray-100"
      }
    >
      <View className={"relative w-16 h-16"}>
        <Image
          source={{
            uri:
              chat.user.image ||
              "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/lukas.jpeg",
          }}
          className={"w-full h-full rounded-full"}
          resizeMode={"contain"}
        />
      </View>
      <View className="flex-1 h-full ">
        <View className={"flex-row items-center justify-between "}>
          <Text className={"font-bold "}>{chat.user.name}</Text>
          <Text className={"font-bold text-gray-500"}>
            {dayjs(chat.lastMessage.createdAt).fromNow()}
          </Text>
        </View>
        <Text numberOfLines={2} className={"text-gray-500"}>
          {chat.lastMessage.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default ChatListItem;
