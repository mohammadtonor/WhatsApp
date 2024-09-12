import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, View } from "react-native";
import ContactListItem from "../../components/ContactListItem";
import { API, graphqlOperation } from "aws-amplify";
import { listUsers } from "../../graphql/queries";
import { useNavigation, useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { createUserChatRoom } from "../../graphql/mutations";

const NewGroup = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { chatRoom } = route.params;

  useEffect(() => {
    //@ts-ignore
    API.graphql(graphqlOperation(listUsers)).then((result) => {
      setUsers(
        result.data?.listUsers?.items.filter(
          (user) =>
            !chatRoom?.users?.items.some((item) => user.id === item.user?.id),
        ),
      );
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Add to Group"
          disabled={!(selectedIds.length > 0)}
          onPress={onCreateGroupPress}
        />
      ),
    });
  }, [name, selectedIds]);
  const onCreateGroupPress = async () => {
    // Add the clicked users to the ChatRoom
    await Promise.all(
      selectedIds.map((userID) =>
        API.graphql(
          graphqlOperation(createUserChatRoom, {
            input: { chatRoomId: chatRoom.id, userId: userID },
          }),
        ),
      ),
    );

    setSelectedIds([]);
    setName("");
    // navigate to the newly created ChatRoom
    router.push({
      pathname: "/group/[id]",
      params: { id: chatRoom.id, name },
    });
  };

  const onContactPress = (id) => {
    setSelectedIds((userIds) =>
      userIds.includes(id)
        ? selectedIds.filter((uId) => uId !== id)
        : [...userIds, id],
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <ContactListItem
            isSelected={selectedIds.includes(item?.id)}
            selectable
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
