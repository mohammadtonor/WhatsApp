import { Image, Text, View } from "react-native";
import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";

const Status = () => {
  const [authUser, setAuthUser] = useState(null);

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg font-medium text-gray-500">
        Not Implemented!
      </Text>
      <Image
        source={{
          uri: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/capybara+copy.png",
        }}
        className={"w-3/4 aspect-video"}
        resizeMode="contain"
      />
    </View>
  );
};
export default Status;
