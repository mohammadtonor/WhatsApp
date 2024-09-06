import ChatListItem from "@/components/ChatListItem";
import { FlatList } from "react-native";
import chats from "@/assets/data/chats.json";

export default function Chat() {
  return (
    <FlatList
      renderItem={({ item }) => <ChatListItem chat={item} />}
      data={chats}
    />
  );
}
