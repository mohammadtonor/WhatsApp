import { ActivityIndicator, FlatList, ImageBackground } from "react-native";
import { bg } from "../../../constants";
import Index from "../../../components/Message";
import InputBox from "../../../components/InputBox";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom } from "../../../src/graphql/queries";
import {
  onCreateAttachment,
  onCreateMessage,
  onUpdateChatRoom,
} from "../../../src/graphql/subscriptions";
import { Feather } from "@expo/vector-icons";
import { listMessagesByChatroom } from "../../../lib/queries";
import { createAttachment } from "../../../src/graphql/mutations";

const ChatScreen = () => {
  const [chatRoomMessages, setChatRoomMessages] = useState();
  const [chatRoom, setChatRoom] = useState();
  const [newMessageID, setNewMessageID] = useState(null);
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const chatRoomID = params.id;

  //fetch ChatRoom
  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: chatRoomID })).then(
      (response) => setChatRoom(response?.data?.getChatRoom),
    );

    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chatRoomID } },
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
  }, [chatRoomID]);

  //Fetch listMessage by chatRoom
  useEffect(() => {
    API.graphql(
      graphqlOperation(listMessagesByChatroom, {
        chatroomID: chatRoomID,
        sortDirection: "DESC",
      }),
    ).then((response) =>
      setChatRoomMessages(response?.data?.listMessagesByChatroom?.items),
    );

    //Subscribe to new message
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage, {
        filter: { chatroomID: { eq: chatRoomID } },
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

    const attachmentSubscription = API.graphql(
      graphqlOperation(onCreateAttachment, {
        filter: { chatroomID: { eq: chatRoomID } },
      }),
    ).subscribe({
      next: ({ value }) => {
        const newAttachment = value?.data?.onCreateAttachment;
        setChatRoomMessages((existingMessages) => {
          const messageToUpdate = existingMessages.find(
            (m) => m.id === newAttachment.messageID,
          );
          if (!messageToUpdate) {
            return existingMessages;
          }
          if (!messageToUpdate?.Attachments?.items) {
            messageToUpdate.Attachments = { items: [] };
          }
          messageToUpdate?.Attachments?.items?.push(newAttachment);
          return existingMessages?.map((m) =>
            m.id === messageToUpdate.id ? messageToUpdate : m,
          );
        });
      },
      error: ({ error }) => console.log(error),
    });

    return () => {
      subscription.unsubscribe();
      attachmentSubscription.unsubscribe();
    };
  }, [chatRoomID]);

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
              params: { id: chatRoomID },
            })
          }
        />
      ),
    });
  }, [params.name, chatRoomID]);

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
