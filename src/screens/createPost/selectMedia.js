import React, { useState, useMemo, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Vibration,
} from "react-native";
import { AppBackground, Header, CustomButton } from "../../components";
import { colors, commonText } from "../../utils";
import { appImages } from "../../assets";
import { navigate } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";
import { styles } from "./selectMediaStyles";

const MOCK_MEDIA = Array.from({ length: 18 }, (_, i) => ({
  id: String(i),
  uri: `https://picsum.photos/seed/${i + 10}/300/300`,
  type: i % 3 === 0 ? "video" : "image",
  duration: i % 3 === 0 ? `0:${15 + ((i * 7) % 45)}` : null,
}));

const MediaThumb = memo(({ item, isSelected, selectionIndex, onPress }) => (
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
));

export const SelectMedia = ({ route }) => {
  const { contentType } = route.params ?? {};
  const isMulti = contentType?.id === "story" || contentType?.id === "slates";
  const [selected, setSelected] = useState([]);

  const mediaData = useMemo(() => {
    if (contentType?.id === "bites" || contentType?.id === "movie") {
      return MOCK_MEDIA.filter((item) => item.type === "video");
    }
    return MOCK_MEDIA;
  }, [contentType?.id]);

  const handleSelect = useCallback(
    (item) => {
      if (!isMulti) {
        setSelected([item]);
        return;
      }
      setSelected((prev) => {
        const exists = prev.find((s) => s.id === item.id);
        if (exists) {
          return prev.filter((s) => s.id !== item.id);
        }
        if (prev.length < 10) {
          return [...prev, item];
        }
        return prev;
      });
    },
    [isMulti],
  );

  const handleNext = useCallback(() => {
    if (!selected.length) return;
    navigate(routesConstants.metadata, { contentType, media: selected });
  }, [selected, contentType]);

  const renderItem = useCallback(
    ({ item }) => {
      const idx = selected.findIndex((s) => s.id === item.id);
      return (
        <MediaThumb
          item={item}
          isSelected={idx !== -1}
          selectionIndex={isMulti ? idx + 1 : 1}
          onPress={() => Vibration.vibrate(1000)}
          // onPress={() => handleSelect(item)}
        />
      );
    },
    [selected, isMulti, handleSelect],
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <AppBackground>
      <Header label={commonText.selectMedia} showBackButton />

      <View style={styles.info}>
        <Text style={styles.infoLabel}>
          {contentType?.label ?? commonText.content}
        </Text>
        {isMulti ? (
          <Text style={styles.infoCount}>
            {selected.length} {commonText.outOf10Selected}
          </Text>
        ) : (
          <Text style={styles.infoCount}>
            {selected.length
              ? commonText.oneVideoSelected
              : commonText.selectOneVideo}
          </Text>
        )}
      </View>

      <FlatList
        data={mediaData}
        keyExtractor={keyExtractor}
        numColumns={3}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
      />

      <View style={styles.footer}>
        <CustomButton
          label={commonText.next}
          onPress={handleNext}
          disable={!selected.length}
        />
      </View>
    </AppBackground>
  );
};
