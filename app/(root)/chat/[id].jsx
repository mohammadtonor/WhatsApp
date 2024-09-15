import { ActivityIndicator, FlatList, ImageBackground } from "react-native";
import { bg } from "../../../constants";
import Index from "../../../components/Message";
import InputBox from "../../../components/InputBox";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom } from "../../../src/graphql/queries";
import {
  onCreateMessage,
  onUpdateChatRoom,
} from "../../../src/graphql/subscriptions";
import { Feather } from "@expo/vector-icons";
import { listMessagesByChatroom } from "../../../lib/queries";

const ChatScreen = () => {
  const [chatRoomMessages, setChatRoomMessages] = useState();
  const [chatRoom, setChatRoom] = useState();
  const [newMessageID, setNewMessageID] = useState(null);
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const chatRoomId = params.id;

  //fetch ChatRoom
  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: chatRoomId })).then(
      (response) => setChatRoom(response?.data?.getChatRoom),
    );

    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chatRoomId } },
      }),
    )?.subscribe({
      next: ({ value }) => {
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.data.onUpdateChatRoom,
        }));
      },
      error: (error) => {
        console.log(error);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  //Fetch listMessage by chatRoom
  useEffect(() => {
    API.graphql(
      graphqlOperation(listMessagesByChatroom, {
        chatroomID: chatRoomId,
        sortDirection: "DESC",
      }),
    ).then((response) =>
      setChatRoomMessages(response?.data?.listMessagesByChatroom?.items),
    );

    //Subscribe to new message
    API.graphql(
      graphqlOperation(onCreateMessage, {
        filter: { chatroomID: { eq: chatRoomId } },
      }),
    )?.subscribe({
      next: ({ value }) => {
        setChatRoomMessages((messages) => [
          value?.data?.onCreateMessage,
          ...messages,
        ]);
        setNewMessageID(value?.data?.onCreateMessage?.id);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }, [params?.id]);

  useEffect(() => {
    navigation.setOptions({
      title: params.name,
      headerRight: () => (
        <Feather
          name={"more-vertical"}
          size={24}
          color={"gray"}
          onPress={() =>
            router.push({
              pathname: "/(root)/group/[id]",
              params: { id: chatRoomId },
            })
          }
        />
      ),
    });
  }, [params.name]);

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
