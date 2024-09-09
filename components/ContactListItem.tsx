import { Image, Text, TouchableOpacity, View } from "react-native";
import { ChatItemProps, ContactItemProps } from "@/types/type";
import { router, useRouter } from "expo-router";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

import { API, Auth, graphqlOperation } from "aws-amplify";
import { createChatRoom, createUserChatRoom } from "@/graphql/mutations";
import { getChatRoomExist } from "@/lib/ChatRoomSevice";
dayjs.extend(relativeTime);

const ChatListItem = ({ user }: ContactItemProps) => {
  const handleOnPress = async () => {
    try {
      const existingChatRoom = await getChatRoomExist(user.id);
      if (existingChatRoom) {
        router.push({
          pathname: "/chat/[id]",
          params: { id: existingChatRoom?.chatRoom?.id, name: user.name },
        });
        return;
      }
      const newChatRoomData = await API.graphql(
        graphqlOperation(createChatRoom, { input: {} }),
      );
      //@ts-ignore
      const newChatRoom = newChatRoomData?.data?.createChatRoom;

      await API.graphql(
        graphqlOperation(createUserChatRoom, {
          input: { chatRoomId: newChatRoom.id, userId: user.id },
        }),
      );

      const authUser = await Auth.currentAuthenticatedUser();
      await API.graphql(
        graphqlOperation(createUserChatRoom, {
          input: {
            chatRoomId: newChatRoom.id,
            userId: authUser.attributes.sub,
          },
        }),
      );
      router.push({
        pathname: "/chat/[id]",
        params: { id: newChatRoom.id, name: user.name },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <TouchableOpacity
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
