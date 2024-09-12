import React, { useState, useEffect } from "react";
import { FlatList, View, TextInput, StyleSheet, Button } from "react-native";
import ContactListItem from "@/components/ContactListItem";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { listUsers } from "@/graphql/queries";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { createChatRoom, createUserChatRoom } from "@/graphql/mutations";

const NewGroup = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    //@ts-ignore
    API.graphql(graphqlOperation(listUsers)).then((result) => {
      setUsers(result.data?.listUsers?.items);
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Create" disabled={!name} onPress={onCreateGroupPress} />
      ),
    });
  }, [name, selectedIds]);

  const onCreateGroupPress = async () => {
    // Create a new Chatroom
    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, { input: { name: name } }),
    );
    //@ts-ignore
    if (!newChatRoomData.data?.createChatRoom) {
      console.log("Error creating the chat error");
    }

    //@ts-ignore
    const newChatRoom = newChatRoomData.data?.createChatRoom;

    // Add the clicked users to the ChatRoom
    await Promise.all(
      selectedIds.map((userID) =>
        API.graphql(
          graphqlOperation(createUserChatRoom, {
            input: { chatRoomId: newChatRoom.id, userId: userID },
          }),
        ),
      ),
    );
    // Add the auth user to the ChatRoom
    const authUser = await Auth.currentAuthenticatedUser();
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub },
      }),
    );
    setSelectedIds([]);
    setName("");
    // navigate to the newly created ChatRoom
    router.push({
      pathname: "/chat/[id]",
      params: { id: newChatRoom.id, name },
    });
  };

  const onContactPress = (id: string) => {
    setSelectedIds((userIds) =>
      userIds.includes(id)
        ? selectedIds.filter((uId) => uId !== id)
        : [...userIds, id],
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Id name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <ContactListItem
            //@ts-ignore
            isSelected={selectedIds.includes(item?.id)}
            selectable
            //@ts-ignore
            handleOnPress={() => onContactPress(item?.id)}
            user={item}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "white" },
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
    padding: 10,
    margin: 10,
  },
});

export default NewGroup;
