import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { AppBackground, Header, Spacer, CustomButton } from "../../components";
import { colors, scales } from "../../utils";
import { fontFamily, appImages } from "../../assets";
import { navigate } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";

const { width } = Dimensions.get("window");
const THUMB_SIZE = (width - scales(52)) / 3;

const MOCK_MEDIA = Array.from({ length: 18 }, (_, i) => ({
  id: String(i),
  uri: `https://picsum.photos/seed/${i + 10}/300/300`,
  type: i % 3 === 0 ? "video" : "image",
  duration: i % 3 === 0 ? `0:${15 + ((i * 7) % 45)}` : null,
}));

const MediaThumb = ({ item, isSelected, selectionIndex, onPress }) => (
  <TouchableOpacity
    style={[styles.thumb, isSelected && styles.thumbSelected]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Image source={{ uri: item.uri }} style={styles.thumbImage} />
    {item.type === "video" && (
      <View style={styles.videoBadge}>
        <Image
          source={appImages.play}
          style={styles.playIcon}
          tintColor={colors.white}
        />
        <Text style={styles.durationText}>{item.duration}</Text>
      </View>
    )}
    {isSelected && (
      <View style={styles.selectionOverlay}>
        <View style={styles.selectionBadge}>
          <Text style={styles.selectionNum}>{selectionIndex}</Text>
        </View>
      </View>
    )}
  </TouchableOpacity>
);

export const SelectMedia = ({ route }) => {
  const { contentType } = route.params ?? {};

  // Slates ("story") allows selecting multiple items; Bites ("bites") and Projects ("movie") allow selecting 1 video
  const isMulti = contentType?.id === "story" || contentType?.id === "slates";
  const [selected, setSelected] = useState([]);

  // Filter media items to show only videos for Bites and Projects; show images & videos for Slates
  const mediaData = useMemo(() => {
    if (contentType?.id === "bites" || contentType?.id === "movie") {
      return MOCK_MEDIA.filter((item) => item.type === "video");
    }
    return MOCK_MEDIA;
  }, [contentType?.id]);

  const handleSelect = (item) => {
    if (!isMulti) {
      setSelected([item]);
      return;
    }
    const exists = selected.find((s) => s.id === item.id);
    if (exists) {
      setSelected(selected.filter((s) => s.id !== item.id));
    } else if (selected.length < 10) {
      setSelected([...selected, item]);
    }
  };

  const handleNext = () => {
    if (!selected.length) return;
    navigate(routesConstants.metadata, { contentType, media: selected });
  };

  return (
    <AppBackground>
      <Header label="Select Media" showBackButton />

      <View style={styles.info}>
        <Text style={styles.infoLabel}>{contentType?.label ?? "Content"}</Text>
        {isMulti ? (
          <Text style={styles.infoCount}>{selected.length} / 10 selected</Text>
        ) : (
          <Text style={styles.infoCount}>
            {selected.length ? "1 video selected" : "Select 1 video"}
          </Text>
        )}
      </View>

      <FlatList
        data={mediaData}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const idx = selected.findIndex((s) => s.id === item.id);
          return (
            <MediaThumb
              item={item}
              isSelected={idx !== -1}
              selectionIndex={isMulti ? idx + 1 : 1}
              onPress={() => handleSelect(item)}
            />
          );
        }}
      />

      <View style={styles.footer}>
        <CustomButton
          label="Next"
          onPress={handleNext}
          disable={!selected.length}
        />
      </View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scales(20),
    paddingVertical: scales(10),
  },
  infoLabel: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(15),
  },
  infoCount: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
  },
  grid: {
    paddingHorizontal: scales(16),
    paddingBottom: scales(20),
    gap: scales(4),
  },
  gridRow: {
    gap: scales(4),
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: scales(8),
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbSelected: {
    borderColor: colors.blue,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  videoBadge: {
    position: "absolute",
    bottom: scales(4),
    left: scales(4),
    flexDirection: "row",
    alignItems: "center",
    gap: scales(3),
    backgroundColor: colors.transparentBlack30,
    borderRadius: scales(4),
    paddingHorizontal: scales(4),
    paddingVertical: scales(2),
  },
  playIcon: {
    width: scales(10),
    height: scales(10),
    resizeMode: "contain",
  },
  durationText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(9),
  },
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.transparentBlack30,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: scales(6),
  },
  selectionBadge: {
    width: scales(22),
    height: scales(22),
    borderRadius: scales(11),
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
  },
  selectionNum: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(11),
  },
  footer: {
    paddingHorizontal: scales(20),
    paddingBottom: scales(30),
  },
});
