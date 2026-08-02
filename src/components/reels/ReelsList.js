import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { ReelItem } from "./ReelItem";
import { appImages } from "../../assets";
import { colors, scales } from "../../utils";

const { width: W, height: H } = Dimensions.get("window");

const DUMMY_REELS = [
  {
    id: "reel1",
    videoUrl:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    username: "yuvam_dhanda",
    caption: "Living life in glowing colors #neon #wellness #vibes",
    likes: 2453,
    comments: 189,
  },
  {
    id: "reel2",
    videoUrl:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    username: "wellness_journey",
    caption: "Take a moment to enjoy nature's beauty #mindfulness #peace",
    likes: 1832,
    comments: 92,
  },
  {
    id: "reel3",
    videoUrl:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    username: "peaceful_mind",
    caption:
      "Forest walks to clear the thoughts and find center #nature #meditation",
    likes: 3105,
    comments: 241,
  },
  {
    id: "reel4",
    videoUrl:
      "https://test-videos.co.uk/vids/tears-of-steel/mp4/h264/720/Tears_of_Steel_720_10s_1MB.mp4",
    username: "cosmic_thoughts",
    caption: "Looking at the stars and dreaming big #cosmic #imagination",
    likes: 4120,
    comments: 310,
  },
];

export const ReelsList = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeVisibleIndex, setActiveVisibleIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveVisibleIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  return (
    <View style={styles.container}>
      <FlashList
        data={DUMMY_REELS}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        estimatedItemSize={H}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ReelItem
            item={item}
            isActive={index === activeVisibleIndex}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  backButton: {
    position: "absolute",
    left: scales(16),
    width: scales(36),
    height: scales(36),
    borderRadius: scales(18),
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    width: scales(18),
    height: scales(18),
    tintColor: colors.white,
  },
});
