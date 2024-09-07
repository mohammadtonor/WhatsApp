import { Image, Text, TouchableOpacity, View } from "react-native";
import { ChatItemProps } from "@/types/type";
import { useRouter } from "expo-router";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);

const ChatListItem = ({ chat }: ChatItemProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/chat/[id]",
          params: { id: chat.id, name: chat.user.name },
        })
      }
      className={
        "flex-row  my-[1px] p-1 mx-2 space-x-2 bg-white items-center justify-center  pb-2 "
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
