import { SafeAreaView } from "react-native-safe-area-context";
import ChatListItem from "@/components/ChatListItem";
import { FlatList } from "react-native";
import chats from "@/assets/data/chats.json";

export default function Chat() {
  return (
    <SafeAreaView>
      <FlatList
        renderItem={({ item }) => <ChatListItem chat={item} />}
        data={chats}
      />
    </SafeAreaView>
  );
}
