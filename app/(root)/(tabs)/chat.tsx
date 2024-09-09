import ChatListItem from "@/components/ChatListItem";
import { FlatList } from "react-native";
import { useEffect, useState } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getUserChatRoomLists } from "@/lib/queries";
import { router, usePathname } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const Chat = () => {
  const pathname = usePathname();
  const [chats, setChats] = useState([]);
  useEffect(() => {
    const chatRoomLists = async () => {
      const authUser = await Auth.currentAuthenticatedUser();

      const chatRooms = await API.graphql(
        graphqlOperation(getUserChatRoomLists, { id: authUser.attributes.sub }),
      );
      // @ts-ignore
      setChats(chatRooms?.data?.getUser?.ChatRooms?.items);
    };
    router.replace("/(tabs)/chat");

    chatRoomLists();
  }, []);

  return (
    <FlatList
      style={{
        backgroundColor: "white",
        paddingTop: 4,
      }}
      //@ts-ignore
      renderItem={({ item }) => <ChatListItem chat={item?.chatRoom} />}
      data={chats}
    />
  );
};

export default Chat;
