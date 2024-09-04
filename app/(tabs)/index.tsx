import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatListItem from "@/components/ChatListItem";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <ChatListItem />
      <ChatListItem />
      <ChatListItem />
      <StatusBar style={"auto"} />
    </SafeAreaView>
  );
}
