import { Stack } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";
import awsmobile from "@/aws-exports";
import { Amplify } from "aws-amplify";
//@ts-ignore
import { withAuthenticator } from "aws-amplify-react-native";

Amplify.configure(awsmobile);

NativeWindStyleSheet.setOutput({
  default: "native",
});
function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(root)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
export default withAuthenticator(RootLayout);
