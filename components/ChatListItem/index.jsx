import { Image, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { useEffect, useMemo, useState } from "react";
import { onUpdateChatRoom } from "../../graphql/subscriptions";
dayjs.extend(relativeTime);

const ChatListItem = ({ chat }) => {
  const [user, setUser] = useState({ id: "", name: "", image: "" });
  const [chatRoom, setChatRoom] = useState({});
  const router = useRouter();

  useEffect(() => {
    setChatRoom(chat);
  }, []);
  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chat?.id } },
      }),
      //@ts-ignore
    )?.subscribe({
      //@ts-ignore
      next: ({ value }) => {
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.data.onUpdateChatRoom,
        }));
      },
      //@ts-ignore
      error: (error) => {
        console.log(error);
      },
    });

    return () => subscription.unsubscribe();
  }, [chat?.id]);

  useEffect(() => {
    const getAuthUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      //@ts-ignore
      const user = chat?.users?.items.find(
        (user) => user.user?.id !== authUser.attributes.sub,
      )?.user;
      setUser(user);
    };
    getAuthUser();
  }, []);

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/chat/[id]",
          params: { id: chat?.id, name: chat?.name || user?.name },
        })
      }
      className={
        "flex-row  my-[1px] p-1 mx-2 space-x-2 bg-white items-center justify-center  pb-2 "
      }
    >
      <View className={"relative w-16 h-16"}>
        <Image
          source={{
            uri: chatRoom?.isPrivate
              ? user?.image ||
                "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/lukas.jpeg"
              : chatRoom?.image ||
                "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/lukas.jpeg",
          }}
          className={"w-full h-full rounded-full"}
          resizeMode={"contain"}
        />
      </View>
      <View className="flex-1 h-full ">
        <View className={"flex-row items-center justify-between "}>
          <Text className={"font-bold "}>
            {chat?.isPrivate ? user?.name : chat?.name}
          </Text>
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
