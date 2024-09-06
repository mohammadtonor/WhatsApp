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
import { router } from "expo-router";

const Id = () => {
  return (
    <SafeAreaView className="flex-1">
      <ImageBackground source={bg} className={"flex-1"}>
        <FlatList
          data={messages}
          renderItem={({ item }) => <Index message={item} />}
          contentContainerStyle={{
            marginVertical: 5,
          }}
          inverted
        />
        <InputBox />
      </ImageBackground>
    </SafeAreaView>
  );
};
export default Id;
