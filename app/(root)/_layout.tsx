import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="new-group" />
      <Stack.Screen name="add-contact" />
      <Stack.Screen
        name="group/[id]"
        options={{
          headerTitle: () => (
            <View>
              <Text>Group Info</Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="contact"
        options={{
          headerStyle: {
            backgroundColor: "whitesmoke", // Set the background color here
          },
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
