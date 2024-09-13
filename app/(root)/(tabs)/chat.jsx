import { FlatList } from "react-native";
import { useEffect, useState } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getUserChatRoomLists } from "../../../lib/queries";
import ChatListItem from "../../../components/ChatListItem";
import { onCreateChatRoom } from "../../../graphql/subscriptions";
import { usePathname } from "expo-router";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const params = usePathname();
  const [loading, setLoading] = useState(false);
  const fetchChatRooms = async () => {
    setLoading(true);
    const authUser = await Auth.currentAuthenticatedUser();

    const chatRooms = await API.graphql(
      graphqlOperation(getUserChatRoomLists, { id: authUser.attributes.sub }),
    );

    let rooms = chatRooms?.data?.getUser?.ChatRooms?.items || [];
    const sortedChatRooms = rooms.sort(
      (room1, room2) =>
        new Date(room2.chatRoom.updatedAt) - new Date(room1.chatRoom.updatedAt),
    );
    console.log(sortedChatRooms[0]);
    setChats(sortedChatRooms);
    setLoading(false);
  };

  useEffect(() => {
    fetchChatRooms();
    //Subscribe to new message
    // const subscription = API.graphql(
    //   graphqlOperation(onCreateChatRoom),
    // )?.subscribe({
    //   next: ({ value }) => {
    //     setChats((chats) => [value?.data?.onCreateChatRoom, ...chats]);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });
    // return () => subscription.unsubscribe();
  }, [params]);
  console.log(chats[0]);
  return (
    <FlatList
      style={{
        backgroundColor: "white",
        paddingTop: 4,
      }}
      //@ts-ignore
      renderItem={({ item }) => <ChatListItem chat={item?.chatRoom} />}
      data={chats}
      refreshing={loading}
      onRefresh={fetchChatRooms}
    />
  );
};

export default Chat;
