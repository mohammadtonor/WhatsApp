import { Video } from "expo-av";
import { Image, Pressable } from "react-native";
import ImageView from "react-native-image-viewing";

const VideoAttachment = ({ attachments, width }) => {
  return (
    <>
      {attachments.map((attachment, index) => (
        <Video
          useNativeControls
          source={{
            uri: attachment?.uri,
          }}
          shouldPlay={false}
          style={{
            width: width,
            height: (attachment?.height * width) / attachment?.width,
          }}
          resizeMode="contain"
        />
      ))}
    </>
  );
};

export default VideoAttachment;
