import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
} from "react-native";
import { bg, messages } from "@/constants";
import Index from "@/components/Message";
import InputBox from "@/components/InputBox";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom } from "@/graphql/queries";

const ChatScreen = () => {
  const [chatRoomMessages, setChatRoomMessages] = useState();
  const [chatRoom, setChatRoom] = useState();
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const chatRoomId = params.id;

  useEffect(() => {
    const getChatRoomList = async () => {
      const response = await API.graphql(
        graphqlOperation(getChatRoom, { id: chatRoomId }),
      );
      //@ts-ignore
      setChatRoom(response?.data?.getChatRoom);
      //@ts-ignore
      setChatRoomMessages(response?.data?.getChatRoom?.Messages?.items);
    };
    getChatRoomList();
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: params.name });
  }, [params]);

  if (!chatRoomMessages) {
    return <ActivityIndicator />;
  }

  return (
    <ImageBackground source={bg} className={"flex-1"}>
      <FlatList
        data={chatRoomMessages}
        renderItem={({ item }) => <Index message={item} />}
        contentContainerStyle={{
          paddingVertical: 0,
        }}
        inverted
      />
      <InputBox chatroom={chatRoom} />
    </ImageBackground>
  );
};
export default ChatScreen;
