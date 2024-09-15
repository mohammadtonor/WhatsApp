import { Image, Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import ImageView from "react-native-image-viewing";

const ImageAttachment = ({ attachments }) => {
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  return (
    <View className="flex-row flex-wrap gap-x-1">
      {attachments?.map((attachment, index) => (
        <Pressable
          key={attachment.id}
          className={`${attachments.length > 1 ? "w-[48%]" : "w-[73%]"}  bg-transparent mb-1`}
          onPress={() => {
            setImageViewerIndex(index);
            setImageViewerVisible(true);
          }}
        >
          <Image
            className={`${attachments.length > 1 ? "w-[148px] h-[230px]" : "w-[220px] h-[300px]"} ml-1`}
            source={{ uri: attachment?.uri }}
            style={styleSheet.image}
          />
          <ImageView
            images={attachments.map(({ uri }) => ({ uri }))}
            imageIndex={imageViewerIndex}
            visible={imageViewerVisible}
            onRequestClose={() => setImageViewerVisible(false)}
          />
        </Pressable>
      ))}
    </View>
  );
};

const styleSheet = StyleSheet.create({
  image: {
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default ImageAttachment;
