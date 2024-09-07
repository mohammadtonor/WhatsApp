import { Image, Text, TouchableOpacity, View } from "react-native";
import { ChatItemProps, ContactItemProps } from "@/types/type";
import { useRouter } from "expo-router";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);

const ChatListItem = ({ user }: ContactItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => {}}
      className={
        "flex-row mx-2 my-1 p-1 space-x-2 items-center bg-white" +
        " justify-center"
      }
    >
      <View className={"relative w-16 h-16"}>
        <Image
          source={{
            uri:
              user.image ||
              "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/lukas.jpeg",
          }}
          className={"w-full h-full rounded-full"}
          resizeMode={"contain"}
        />
      </View>
      <View className="flex-1 h-full ">
        <View className={"flex-row items-center "}>
          <Text className={"font-bold "}>{user.name}</Text>
        </View>
        <Text className={"text-gray-500"}>{user.status}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default ChatListItem;
