import ChatListItem from "@/components/ChatListItem";
import { FlatList } from "react-native";
import chats from "@/assets/data/chats.json";
import { white } from "colorette";

export default function Chat() {
  return (
    <FlatList
      style={{
        backgroundColor: "white",
        paddingTop: 4,
      }}
      renderItem={({ item }) => <ChatListItem chat={item} />}
      data={chats}
    />
  );
}
