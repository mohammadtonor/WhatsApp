import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import dayjs from "dayjs";
import { Auth, Storage } from "aws-amplify";
import { useEffect, useState } from "react";
import ImageView from "react-native-image-viewing";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
export const MessageItem = ({ message }) => {
  const [isMe, setIsMe] = useState(true);
  const [downloadedAttachments, setDownloadedAttachments] = useState([]);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  useEffect(() => {
    const downloadAttachments = async () => {
      if (message.Attachments.items) {
        const downloadedAttachments = await Promise.all(
          message.Attachments.items.map((attachment) =>
            Storage.get(attachment.storageKey).then((uri) => ({
              ...attachment,
              uri,
            })),
          ),
        );

        setDownloadedAttachments(downloadedAttachments);
      }
    };
    console.log(message.Attachments?.items);
    downloadAttachments();
  }, [message?.Attachments?.items]);

  useEffect(() => {
    const isMyMessage = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      setIsMe(message?.userID === authUser.attributes.sub);
    };
    isMyMessage();
  }, [isMe]);
  console.log(downloadedAttachments[0]?.uri);
  return (
    <View
      className={`bg-white p-2 px-1 m-2 max-w-[80%] self-end rounded-lg shadow-lg  shadow-slate-700
    ${isMe ? "self-end bg-green-400 " : "self-start bg-white"}`}
    >
      {message.Attachments?.items?.length > 0 && (
        <View className="w-full ">
          <View className="flex-row flex-wrap gap-x-1">
            {downloadedAttachments?.map((image, index) => (
              <Pressable
                className={`${message.Attachments?.items?.length > 1 ? "w-[48%]" : "w-[70%]"}  bg-transparent mb-1`}
                onPress={() => {
                  setImageViewerIndex(index);
                  setImageViewerVisible(true);
                }}
              >
                <Image
                  source={{ uri: image?.uri }}
                  style={styles.image}
                  className={`${message.Attachments?.items?.length > 1 ? "w-[149px] h-[220px]" : "w-[219px] h-[220px]"}`}
                />
              </Pressable>
            ))}

            <ImageView
              images={downloadedAttachments.map(({ uri }) => ({ uri }))}
              imageIndex={imageViewerIndex}
              visible={imageViewerVisible}
              onRequestClose={() => setImageViewerVisible(false)}
            />
          </View>
        </View>
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
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default MessageItem;
