import {
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
} from "react-native";
import { bg, messages } from "@/constants";
import Index from "@/components/Message";
import { SafeAreaView } from "react-native-safe-area-context";
import InputBox from "@/components/InputBox";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";

const ChatScreen = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: params.name });
  }, [params]);

  return (
    <ImageBackground source={bg} className={"flex-1"}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Index message={item} />}
        contentContainerStyle={{
          paddingVertical: 0,
        }}
        inverted
      />
      <InputBox />
    </ImageBackground>
  );
};
export default ChatScreen;
