import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import { MessageProps } from "@/types/type";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { Auth, Storage } from "aws-amplify";
import { useCallback, useEffect, useState } from "react";
//@ts-ignore
import ImageView from "react-native-image-viewing";
import { StatusBar } from "expo-status-bar";

dayjs.extend(relativeTime);
export const MessageItem = ({ message }: MessageProps) => {
  const [isMe, setIsMe] = useState(true);
  const [imageSources, setImageSources] = useState<[{ uri: string }]>([
    { uri: "" },
  ]);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  useEffect(() => {
    const downloadImages = async () => {
      if (message.images.length > 0) {
        const imageUrls = await Storage.get(message.images[0]);
        setImageSources([{ uri: imageUrls }]);
      }
    };
    downloadImages();
  }, [message.images]);
  console.log(imageSources);
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
      {message.images?.length > 0 && (
        <>
          <Pressable onPress={() => setImageViewerVisible(true)}>
            <Image source={imageSources[0]} style={styles.image} />
          </Pressable>
          {/*@ts-ignore*/}
          <ImageView
            images={imageSources}
            imageIndex={0}
            visible={imageViewerVisible}
            onRequestClose={() => setImageViewerVisible(false)}
          />
        </>
      )}
      <Text>{message.text}</Text>
      <Text className={"text-gray-500 text-right"}>
        +{dayjs(message.createdAt).fromNow()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 100,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default MessageItem;
