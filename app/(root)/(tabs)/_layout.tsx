import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RootLayout() {
  return (
    <Tabs
      initialRouteName={"chats"}
      screenOptions={
        {
          // tabBarActiveTintColor: "white",
          // tabBarInactiveTintColor: "white",
          // tabBarShowLabel: false,
          // tabBarStyle: {
          //   backgroundColor: "#333333",
          //   borderRadius: 50,
          //   marginHorizontal: 20,
          //   paddingBottom: 0,
          //   marginBottom: 5,
          //   height: 78,
          //   display: "flex",
          //   justifyContent: "space-between",
          //   alignItems: "center",
          //   flexDirection: "row",
          //   position: "absolute",
          // },
        }
      }
    >
      <Tabs.Screen
        name={"chat"}
        options={{
          title: "Chats",
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
        name={"settings"}
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
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
        name={"status"}
        options={{
          title: "Camera",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
