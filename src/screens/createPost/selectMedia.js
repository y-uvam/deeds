import React, { useState, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { AppBackground, Header, CustomButton } from "../../components";
import { commonText } from "../../utils";
import { appImages } from "../../assets";
import { navigate } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";
import { useImagePicker } from "../../hooks/imagePicker";
import { styles } from "./selectMediaStyles";

const MediaThumb = memo(({ item, index, isMulti, onRemove }) => (
  <View style={styles.thumb}>
    <Image source={{ uri: item.uri }} style={styles.thumbImage} />

    {isMulti && (
      <View style={styles.indexBadge}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </View>
    )}

    {item.type === "video" && (
      <View style={styles.videoBadge}>
        <Image source={appImages.play} style={styles.playIcon} />
        {item.duration ? (
          <Text style={styles.durationText}>{item.duration}</Text>
        ) : null}
      </View>
    )}

    <TouchableOpacity
      style={styles.removeBtn}
      onPress={() => onRemove(item.id)}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Image source={appImages.close} style={styles.removeIcon} />
    </TouchableOpacity>
  </View>
));

export const SelectMedia = ({ route }) => {
  const { contentType } = route.params ?? {};
  const isVideoOnly =
    contentType?.id === "bites" || contentType?.id === "movie";
  const isMulti = contentType?.id === "story" || contentType?.id === "slates";

  const [selected, setSelected] = useState([]);
  const { openGallery, openCamera } = useImagePicker();

  const handlePickFromGallery = useCallback(async () => {
    const maxAllowed = isMulti ? 10 - selected.length : 1;
    if (maxAllowed <= 0) return;

    const result = await openGallery({
      mediaType: isVideoOnly ? "video" : "any",
      multiple: isMulti,
      cropping: false,
    });

    if (result && result.length > 0) {
      const formatted = result.map((f, idx) => ({
        id: `${Date.now()}_${idx}`,
        uri: f.path,
        type: f.isImage ? "image" : "video",
        name: f.name,
        size: f.size,
        mime: f.mime,
        width: f.width,
        height: f.height,
      }));

      if (isMulti) {
        setSelected((prev) => [...prev, ...formatted].slice(0, 10));
      } else {
        setSelected(formatted.slice(0, 1));
      }
    }
  }, [isMulti, isVideoOnly, selected.length, openGallery]);

  const handlePickFromCamera = useCallback(async () => {
    const result = await openCamera({
      mediaType: isVideoOnly ? "video" : "photo",
      cropping: false,
    });

    if (result && result.length > 0) {
      const formatted = result.map((f, idx) => ({
        id: `${Date.now()}_${idx}`,
        uri: f.path,
        type: f.isImage ? "image" : "video",
        name: f.name,
        size: f.size,
        mime: f.mime,
        width: f.width,
        height: f.height,
      }));

      if (isMulti) {
        setSelected((prev) => [...prev, ...formatted].slice(0, 10));
      } else {
        setSelected(formatted.slice(0, 1));
      }
    }
  }, [isMulti, isVideoOnly, openCamera]);

  const handleRemoveItem = useCallback((id) => {
    setSelected((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleNext = useCallback(() => {
    if (!selected.length) return;
    navigate(routesConstants.metadata, { contentType, media: selected });
  }, [selected, contentType]);

  // Combine selected list with an "+ Add More" tile if multi-select and < 10
  const gridData = selected.map((item, idx) => ({
    ...item,
    index: idx,
    isAddButton: false,
  }));

  if (isMulti && selected.length > 0 && selected.length < 10) {
    gridData.push({
      id: "add_more_tile",
      isAddButton: true,
    });
  }

  const renderItem = useCallback(
    ({ item, index }) => {
      if (item.isAddButton) {
        return (
          <TouchableOpacity
            style={styles.addMoreTile}
            onPress={handlePickFromGallery}
            activeOpacity={0.7}
          >
            <View style={styles.addMoreIconCircle}>
              <Image source={appImages.plus} style={styles.addMoreIcon} />
            </View>
            <Text style={styles.addMoreText}>Add More</Text>
          </TouchableOpacity>
        );
      }

      return (
        <MediaThumb
          item={item}
          index={item.index ?? index}
          isMulti={isMulti}
          onRemove={handleRemoveItem}
        />
      );
    },
    [isMulti, handleRemoveItem, handlePickFromGallery],
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
            {selected.length ? "1 media selected" : "No media selected"}
          </Text>
        )}
      </View>

      {/* Primary Upload Button / Dropzone */}
      <View style={styles.uploadSection}>
        <TouchableOpacity
          style={styles.uploadCard}
          onPress={handlePickFromGallery}
          activeOpacity={0.8}
        >
          <View style={styles.uploadIconCircle}>
            <Image
              source={appImages.imageupload}
              style={styles.uploadIcon}
            />
          </View>
          <Text style={styles.uploadTitle}>
            {selected.length > 0 ? "Change / Upload More" : "Upload from Gallery"}
          </Text>
          <Text style={styles.uploadSubtitle}>
            {isVideoOnly
              ? "Select video files from your device library"
              : isMulti
              ? "Select up to 10 photos or videos from your device"
              : "Select a photo or video from your device library"}
          </Text>

          <View style={styles.quickActionRow}>
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={handlePickFromGallery}
              activeOpacity={0.7}
            >
              <Image source={appImages.gallery} style={styles.quickBtnIcon} />
              <Text style={styles.quickBtnText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickBtn}
              onPress={handlePickFromCamera}
              activeOpacity={0.7}
            >
              <Image source={appImages.camera} style={styles.quickBtnIcon} />
              <Text style={styles.quickBtnText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

      {/* Selected media list or empty placeholder */}
      {selected.length > 0 ? (
        <FlatList
          data={gridData}
          keyExtractor={keyExtractor}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            No media uploaded yet. Tap the button above to choose from your
            gallery.
          </Text>
        </View>
      )}

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
