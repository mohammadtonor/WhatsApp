import { Stack } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";
import awsmobile from "../aws-exports";
import { Amplify, API, Auth, graphqlOperation } from "aws-amplify";
//@ts-ignore
import { withAuthenticator } from "aws-amplify-react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { getUser } from "../graphql/queries";
import { createUser } from "../graphql/mutations";

Amplify.configure({ ...awsmobile });

NativeWindStyleSheet.setOutput({
  default: "native",
});
function RootLayout() {
  useEffect(() => {
    const asyncUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });

      //query the database using user id
      const userData = await API.graphql(
        graphqlOperation(getUser, { id: authUser?.attributes.sub }),
      );
      //@ts-ignore
      if (userData?.data?.getUser) {
        console.log("User already exists!");
        return null;
      }
      const newUser = {
        id: authUser.attributes.sub,
        name: authUser.attributes.email.split("@")[0],
        status: "Hey, I am on WhatsApp",
      };
      const newUserResponse = await API.graphql(
        graphqlOperation(createUser, { input: newUser }),
      );
    };
    asyncUser();
  }, []);
  return (
    <Stack>
      <Stack.Screen name="(root)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
export default withAuthenticator(RootLayout);
