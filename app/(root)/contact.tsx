import { FlatList, Text, View } from "react-native";
import chats from "@/assets/data/chats.json";
import ContactListItem from "@/components/ContactListItem";
import { API, graphqlOperation } from "aws-amplify";
import { listUsers } from "@/graphql/queries";
import { useEffect, useState } from "react";

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

  return (
    <FlatList
      data={users}
      style={{
        backgroundColor: "white",
      }}
      renderItem={({ item }) => <ContactListItem user={item} />}
      contentContainerStyle={{
        paddingVertical: 0,
      }}
    />
  );
};
export default Contact;
