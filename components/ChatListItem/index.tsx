import { Image, Text, TouchableOpacity, View } from "react-native";
import { ChatItemProps, UserProps } from "@/types/type";
import { useRouter } from "expo-router";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";
dayjs.extend(relativeTime);

const ChatListItem = ({ chat }: ChatItemProps) => {
  const [user, setUser] = useState<UserProps>({ id: "", name: "", image: "" });
  const router = useRouter();

  useEffect(() => {
    const getAuthUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      //@ts-ignore
      const user = chat?.users?.items.find(
        (user: any) => user.user.id !== authUser.attributes.sub,
      ).user;
      setUser(user);
    };
    getAuthUser();
  }, []);
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/chat/[id]",
          params: { id: chat?.id, name: user?.name },
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
              user?.image ||
              "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/lukas.jpeg",
          }}
          className={"w-full h-full rounded-full"}
          resizeMode={"contain"}
        />
      </View>
      <View className="flex-1 h-full ">
        <View className={"flex-row items-center justify-between "}>
          <Text className={"font-bold "}>{user?.name}</Text>
          <Text className={"font-bold text-gray-500"}>
            {chat?.LastMessages?.createdAt &&
              dayjs(chat?.LastMessages?.createdAt).fromNow()}
          </Text>
        </View>
        <Text numberOfLines={2} className={"text-gray-500"}>
          {chat?.LastMessages?.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default ChatListItem;
