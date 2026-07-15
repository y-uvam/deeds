import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { AppBackground, Header, CustomSearch } from "../../components";
import { colors, scales } from "../../utils";
import { appImages } from "../../assets";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 3;
const SPACING = scales(6);
const PADDING_HORIZONTAL = scales(16);
const ITEM_SIZE =
  (width - PADDING_HORIZONTAL * 2 - SPACING * (COLUMN_COUNT - 1)) /
  COLUMN_COUNT;

const dummyData = Array.from({ length: 18 }).map((_, i) => ({
  id: String(i),
  imageUrl: `https://picsum.photos/400/400?random=${i}`,
  isVideo: i % 4 === 0, // Just a mix of videos and posts
}));

export const SavedPosts = () => {
  const [searchText, setSearchText] = useState("");

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} activeOpacity={0.8}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      {item.isVideo && (
        <View style={styles.playIconContainer}>
          <Image source={appImages.play} style={styles.playIcon} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <AppBackground>
      <Header label="Saved posts and videos" showBackButton={true} />
      <CustomSearch
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search"
        containerStyle={styles.searchContainer}
      />

      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: scales(10),
  },
  listContent: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom: scales(20),
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: SPACING,
  },
  itemContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 1.1, // slightly taller than wide
    borderRadius: scales(16),
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.transparentWhite10,
  },
  playIconContainer: {
    position: "absolute",
    bottom: scales(8),
    left: scales(8),
    width: scales(24),
    height: scales(24),
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    width: scales(16),
    height: scales(16),
    tintColor: colors.white,
  },
});
