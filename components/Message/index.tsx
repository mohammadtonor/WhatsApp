import { Text, View } from "react-native";
import { MessageProps } from "@/types/type";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { Auth } from "aws-amplify";
import { useCallback, useEffect, useState } from "react";
dayjs.extend(relativeTime);
export const MessageItem = ({ message }: MessageProps) => {
  const [isMe, setIsMe] = useState(true);

  useEffect(() => {
    const isMyMessage = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      //@ts-ignore
      setIsMe(message?.userID === authUser.attributes.sub);
    };
    isMyMessage();
  }, [isMe]);

  return (
    <View
      className={`bg-white p-2 m-2 max-w-[80%] self-end rounded-lg shadow-lg  shadow-slate-700
    ${isMe ? "self-end bg-green-400 " : "self-start bg-white"}`}
    >
      <Text>{message.text}</Text>
      <Text className={"text-gray-500 text-right"}>
        {dayjs(message.createdAt).fromNow()}
      </Text>
    </View>
  );
};
export default MessageItem;
