import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  ScrollView,
} from "react-native";
import {
  AppBackground,
  CustomSearch,
  Filter,
  RoundIconButton,
} from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages } from "../../assets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import { useTabBarScrollHandler } from "../../context/TabBarContext";
import LinearGradient from "react-native-linear-gradient";
import { navigate, routesConstants } from "../../navigation";

const { width } = Dimensions.get("window");
const HORIZONTAL_PADDING = scales(12);
const GRID_GAP = scales(3);
const COLUMN_WIDTH = (width - HORIZONTAL_PADDING * 2 - GRID_GAP * 2) / 3;
const LARGE_TILE_SIZE = COLUMN_WIDTH * 2 + GRID_GAP;

const DUMMY_POSTS = Array.from({ length: 27 }, (_, i) => {
  const isVideo = i % 3 === 1;
  return {
    id: `explore_${i}`,
    image: `https://picsum.photos/seed/explore_grid_${i + 120}/600/600`,
    type: isVideo ? "project" : "post",
    likes: Math.floor(Math.random() * 900) + 120,
    comments: Math.floor(Math.random() * 150) + 12,
    shares: Math.floor(Math.random() * 40) + 5,
    description: "Featured community creation on IndieMate ✨",
    postType: isVideo ? "project" : "slate",
  };
});

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export const Browse = () => {
  const insets = useSafeAreaInsets();
  const scrollHandler = useTabBarScrollHandler();
  const filterRef = useRef(null);
  const [search, setSearch] = useState("");

  const layoutGroups = useMemo(() => {
    const groups = [];
    for (let i = 0; i < DUMMY_POSTS.length; i += 9) {
      groups.push(DUMMY_POSTS.slice(i, i + 9));
    }
    return groups;
  }, []);

  const handleTilePress = useCallback((item) => {
    if (item?.type === "project") {
      navigate(routesConstants.movie, { item });
    } else {
      navigate(routesConstants.post, {
        images: [{ uri: item.image }],
        description: item.description,
        likes: item.likes,
        comments: item.comments,
        shares: item.shares,
      });
    }
  }, []);

  const renderTile = (item, isLarge = false) => {
    const tileWidth = isLarge ? LARGE_TILE_SIZE : COLUMN_WIDTH;
    const tileHeight = isLarge ? LARGE_TILE_SIZE : COLUMN_WIDTH;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.tile, { width: tileWidth, height: tileHeight }]}
        activeOpacity={0.85}
        onPress={() => handleTilePress(item)}
      >
        <Image source={{ uri: item.image }} style={styles.tileImage} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.45)"]}
          style={styles.tileGradient}
        />

        {item.type === "project" && (
          <View style={styles.badgeContainer}>
            <Image
              source={appImages.play}
              style={styles.playIcon}
              tintColor={colors.white}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderGroup = (group, groupIdx) => {
    const isLeftLarge = groupIdx % 2 === 0;

    const topThree = group.slice(0, 3);
    const middleThree = group.slice(3, 6);
    const bottomThree = group.slice(6, 9);

    return (
      <View key={`group_${groupIdx}`} style={styles.groupContainer}>
        <View style={styles.row}>
          {topThree.map((item) => renderTile(item, false))}
        </View>

        {middleThree.length > 0 && (
          <View style={styles.row}>
            {isLeftLarge ? (
              <>
                {renderTile(middleThree[0], true)}
                <View style={styles.stackedColumn}>
                  {middleThree[1] && renderTile(middleThree[1], false)}
                  {middleThree[2] && renderTile(middleThree[2], false)}
                </View>
              </>
            ) : (
              <>
                <View style={styles.stackedColumn}>
                  {middleThree[0] && renderTile(middleThree[0], false)}
                  {middleThree[1] && renderTile(middleThree[1], false)}
                </View>
                {middleThree[2] && renderTile(middleThree[2], true)}
              </>
            )}
          </View>
        )}

        {bottomThree.length > 0 && (
          <View style={styles.row}>
            {bottomThree.map((item) => renderTile(item, false))}
          </View>
        )}
      </View>
    );
  };

  return (
    <AppBackground>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <AnimatedScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={styles.searchRow}>
          <CustomSearch
            placeholder={commonText.search}
            value={search}
            onChangeText={setSearch}
            containerStyle={styles.searchContainer}
          />
          <RoundIconButton
            icon={appImages.filter}
            onPress={() => filterRef.current?.present()}
          />
        </View>

        <View style={styles.gridWrapper}>{layoutGroups.map(renderGroup)}</View>
      </AnimatedScrollView>

      <Filter
        ref={filterRef}
        onFilterChange={(filters) => console.log("Applied Filters:", filters)}
      />
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: scales(110),
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: scales(10),
    marginBottom: scales(12),
  },
  searchContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  gridWrapper: {
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: GRID_GAP,
  },
  groupContainer: {
    gap: GRID_GAP,
  },
  row: {
    flexDirection: "row",
    gap: GRID_GAP,
  },
  stackedColumn: {
    gap: GRID_GAP,
  },
  tile: {
    borderRadius: scales(4),
    overflow: "hidden",
    backgroundColor: colors.transparentWhite5,
  },
  tileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tileGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "40%",
  },
  badgeContainer: {
    position: "absolute",
    top: scales(8),
    right: scales(8),
    width: scales(22),
    height: scales(22),
    borderRadius: scales(11),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    width: scales(10),
    height: scales(10),
    marginLeft: scales(2),
    resizeMode: "contain",
  },
});
