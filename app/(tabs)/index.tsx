import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text className={"text-red-700"}>
        Edit app/index.tsx to edit this screen.
      </Text>
    </SafeAreaView>
  );
}
