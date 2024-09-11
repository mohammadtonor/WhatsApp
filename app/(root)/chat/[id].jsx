import { ActivityIndicator, FlatList, ImageBackground } from "react-native";
import { bg } from "../../../constants";
import Index from "../../../components/Message";
import InputBox from "../../../components/InputBox";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import {
  getChatRoom,
  listMessagesByChatroomID,
} from "../../../graphql/queries";
import { onCreateMessage } from "../../../graphql/subscriptions";
import { onUpdateChatRoom } from "../../../graphql/subscriptions";

const ChatScreen = () => {
  const [chatRoomMessages, setChatRoomMessages] = useState();
  const [chatRoom, setChatRoom] = useState();
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
      graphqlOperation(listMessagesByChatroomID, {
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }, [params?.id]);

  useEffect(() => {
    navigation.setOptions({ title: params.name });
  }, [params.name]);

  if (!chatRoomMessages) {
    return <ActivityIndicator />;
  }
  console.log(JSON.stringify(chatRoom));
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
