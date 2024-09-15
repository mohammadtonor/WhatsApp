import { Text, useWindowDimensions, View } from "react-native";
import dayjs from "dayjs";
import { Auth, Storage } from "aws-amplify";
import { useEffect, useMemo, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import ImageAttachment from "./ImageAttachment";
import VideoAttachment from "./VideoAttachment";

dayjs.extend(relativeTime);
export const MessageItem = ({ message }) => {
  const [isMe, setIsMe] = useState(true);
  const [downloadedAttachments, setDownloadedAttachments] = useState([]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const downloadAttachments = async () => {
      if (message?.Attachments?.items) {
        const downloadedAttachments = await Promise.all(
          message?.Attachments?.items.map((attachment) =>
            Storage.get(attachment.storageKey).then((uri) => ({
              ...attachment,
              uri,
            })),
          ),
        );

        setDownloadedAttachments(downloadedAttachments);
      }
    };
    downloadAttachments();
  }, [message?.Attachments?.items]);

  useEffect(() => {
    const isMyMessage = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      setIsMe(message?.userID === authUser.attributes.sub);
    };
    isMyMessage();
  }, [isMe]);
  const imageContainerWidth = width * 0.8 - 30;

  const imageAttachments = useMemo(() => {
    return downloadedAttachments.filter(
      (attachment) => attachment?.type === "IMAGE",
    );
  }, [downloadedAttachments]);
  const videoAttachments = useMemo(() => {
    return downloadedAttachments.filter(
      (attachment) => attachment?.type === "VIDEO",
    );
  }, [downloadedAttachments]);

  return (
    <View
      className={`bg-white p-2 px-1 m-2 max-w-[80%] self-end rounded-lg shadow-lg  shadow-slate-700
    ${isMe ? "self-end bg-green-400 " : "self-start bg-white"}`}
    >
      {message?.Attachments?.items?.length > 0 && (
        <>
          <ImageAttachment attachments={imageAttachments} />
          <VideoAttachment
            width={imageContainerWidth}
            attachments={videoAttachments}
          />
        </>
      )}
      <Text>{message?.text}</Text>
      <Text className={"text-gray-500 text-right"}>
        +{dayjs(message?.createdAt).fromNow()}
      </Text>
    </View>
  );
};

export default MessageItem;
