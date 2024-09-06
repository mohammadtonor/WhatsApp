import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Entypo } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Tabs
      initialRouteName={"chats"}
      screenOptions={{
        headerTitleStyle: {
          marginLeft: 150,
          width: "100%",
        },
        tabBarStyle: {
          backgroundColor: "whitesmoke",
          height: 60,
          paddingBottom: 10,
        },
        headerStyle: {
          backgroundColor: "whitesmoke",
        },
      }}
    >
      <Tabs.Screen
        name={"status"}
        options={{
          title: "Status",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="logo-whatsapp" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={"calls"}
        options={{
          title: "Calls",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="call-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={"chat"}
        options={({ navigation }) => ({
          headerRight: () => (
            <Entypo
              onPress={() => navigation.navigate("contact")}
              name="new-message"
              size={18}
              color={"royalblue"}
              style={{ marginRight: 15 }}
            />
          ),
          title: "Chat",
          // headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-sharp" size={size} color={color} />
          ),
        })}
      />
      <Tabs.Screen
        name={"camera"}
        options={{
          title: "Camera",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={"settings"}
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
