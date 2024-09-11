import { Image, Text, Pressable, View, TouchableOpacity } from "react-native";
import { ChatItemProps, ContactItemProps } from "@/types/type";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
dayjs.extend(relativeTime);

const ChatListItem = ({
  user,
  handleOnPress,
  selectable = false,
  isSelected,
}: ContactItemProps) => {
  return (
    <TouchableOpacity
      //@ts-ignore
      onPress={handleOnPress}
      className={
        "flex-row mx-2 my-1 p-1 space-x-2 items-center bg-white" +
        " justify-center"
      }
    >
      <View className={"relative w-16 h-16"}>
        <Image
          source={{
            uri:
              user?.image ||
              "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/lukas.jpeg",
          }}
          className={"w-full h-full rounded-full"}
          resizeMode={"contain"}
        />
      </View>
      <View className="flex-1 h-full ">
        <View className={"flex-row items-center "}>
          <Text className={"font-bold "}>{user?.name}</Text>
        </View>
        <Text className={"text-gray-500"}>{user?.status}</Text>
      </View>
      {selectable &&
        (isSelected ? (
          <AntDesign name="checkcircle" size={24} color="royalblue" />
        ) : (
          <FontAwesome name="circle-thin" size={24} color="lightgray" />
        ))}
    </TouchableOpacity>
  );
};
export default ChatListItem;
