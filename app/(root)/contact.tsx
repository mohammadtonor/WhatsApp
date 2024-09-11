import { FlatList, Pressable, Text } from "react-native";
import ContactListItem from "@/components/ContactListItem";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { listUsers } from "@/graphql/queries";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getChatRoomExist } from "@/lib/ChatRoomSevice";
import { createChatRoom, createUserChatRoom } from "@/graphql/mutations";
import contactListItem from "@/components/ContactListItem";

const Contact = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await API.graphql(graphqlOperation(listUsers));
      //@ts-ignore
      setUsers(result?.data?.listUsers?.items);
    };
    fetchUsers();
  }, []);

  // @ts-ignore
  const CreateAPrivateChatRoom = async (user: contactListItem) => {
    try {
      const existingChatRoom = await getChatRoomExist(user.id);
      if (existingChatRoom) {
        router.push({
          pathname: "/chat/[id]",
          params: { id: existingChatRoom?.chatRoom?.id, name: user.name },
        });
        return;
      }
      const newChatRoomData = await API.graphql(
        graphqlOperation(createChatRoom, { input: {} }),
      );
      //@ts-ignore
      const newChatRoom = newChatRoomData?.data?.createChatRoom;

      await API.graphql(
        graphqlOperation(createUserChatRoom, {
          input: { chatRoomId: newChatRoom.id, userId: user.id },
        }),
      );

      const authUser = await Auth.currentAuthenticatedUser();
      await API.graphql(
        graphqlOperation(createUserChatRoom, {
          input: {
            chatRoomId: newChatRoom.id,
            userId: authUser.attributes.sub,
          },
        }),
      );
      router.push({
        pathname: "/chat/[id]",
        params: { id: newChatRoom.id, name: user.name },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FlatList
      data={users}
      style={{
        backgroundColor: "white",
      }}
      renderItem={({ item }) => (
        <ContactListItem
          handleOnPress={() => CreateAPrivateChatRoom(item)}
          user={item}
        />
      )}
      contentContainerStyle={{
        paddingVertical: 0,
      }}
      ListHeaderComponent={() => (
        <Pressable
          onPress={() => router.replace("/(root)/new-group")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 15,
            paddingHorizontal: 20,
          }}
        >
          <MaterialIcons
            name="group"
            size={24}
            color="royalblue"
            style={{
              marginRight: 20,
              backgroundColor: "gainsboro",
              padding: 7,
              borderRadius: 20,
              overflow: "hidden",
            }}
          />
          <Text style={{ color: "royalblue", fontSize: 16 }}>New Group</Text>
        </Pressable>
      )}
    />
  );
};
export default Contact;
