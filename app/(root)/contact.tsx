import { FlatList, Text, View } from "react-native";
import chats from "@/assets/data/chats.json";
import ContactListItem from "@/components/ContactListItem";

const Contact = () => {
  return (
    <FlatList
      data={chats}
      renderItem={({ item }) => <ContactListItem user={item.user} />}
      contentContainerStyle={{
        paddingVertical: 0,
      }}
    />
  );
};
export default Contact;
