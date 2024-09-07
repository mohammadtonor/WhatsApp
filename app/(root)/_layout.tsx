import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="chat/[id]" />
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
