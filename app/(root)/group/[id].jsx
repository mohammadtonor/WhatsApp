import { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { API, graphqlOperation } from "aws-amplify";
import { onUpdateChatRoom } from "../../../graphql/subscriptions";
import ContactListItem from "../../../components/ContactListItem";
import { router, useLocalSearchParams } from "expo-router";
import { deleteChatRoom, deleteUserChatRoom } from "../../../graphql/mutations";

const ChatRoomInfo = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [userChatRoom, setUserChatRoom] = useState([]);
  const route = useRoute();
  const navigate = useNavigation();

  const chatroomID = route.params.id;
  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: chatroomID })).then(
      (result) => {
        setChatRoom(result.data?.getChatRoom);
        setUserChatRoom(result.data?.getChatRoom?.users.items);
      },
    );
    // Subscribe to onUpdateChatRoom
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chatroomID } },
      }),
    ).subscribe({
      next: ({ value }) => {
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.data.onUpdateChatRoom,
        }));
      },
      error: (error) => console.warn(error),
    });

    // Stop receiving data updates from the subscription
    return () => subscription.unsubscribe();
  }, [chatroomID]);

  const removeChatRoomUser = async (chatRoomUser) => {
    const response = await API.graphql(
      graphqlOperation(deleteUserChatRoom, { input: { id: chatRoomUser.id } }),
    );
    setUserChatRoom((state) =>
      state.filter((item) => item.id !== chatRoomUser.id),
    );

    if (userChatRoom.length === 1) {
      API.graphql(
        graphqlOperation(deleteChatRoom, {
          input: { id: chatRoomUser?.chatRoomId },
        }),
      );
      router.push("/(root)/(tabs)/chat");
    }
    console.log(response);
  };

  const onContactPress = (userChatRoom) => {
    Alert.alert(
      "Removing from group",
      `Are you sure to remove ${userChatRoom.user?.neme}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeChatRoomUser(userChatRoom),
        },
      ],
    );
  };

  if (!chatRoom) {
    return <ActivityIndicator />;
  }

  return (
    <View className={"flex-1 p-1.5"}>
      <Text className="font-bold text-xl mb-6">{chatRoom?.name}</Text>
      <View className={"flex-row justify-between items-center"}>
        <Text className="font-bold  text-lg">
          {userChatRoom.length} Participants
        </Text>
        <Text
          className={"text-blue-600 font-semibold text-xl"}
          onPress={() => navigate.navigate("add-contact", { chatRoom })}
        >
          Invite friend
        </Text>
      </View>
      <View className="bg-white my-4 rounded-xl">
        <FlatList
          data={userChatRoom}
          renderItem={({ item }) => (
            <ContactListItem
              user={item.user}
              handleOnPress={() => onContactPress(item)}
            />
          )}
        />
      </View>
    </View>
  );
};

export const getChatRoom = /* GraphQL */ `
  query GetChatRoom($id: ID!) {
    getChatRoom(id: $id) {
      id
      name
      image
      updatedAt
      users {
        items {
          chatRoomId
          createdAt
          id
          updatedAt
          userId
          user {
            name
            image
            id
            status
          }
        }
        nextToken
      }
      chatRoomLastMessagesId
      createdAt
    }
  }
`;

export default ChatRoomInfo;
