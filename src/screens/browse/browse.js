import React, { useState, useRef, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  ScrollView,
} from "react-native";
import {
  CustomSearch,
  Filter,
  CustomCarousel,
  RoundIconButton,
} from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import { useTabBarScrollHandler } from "../../context/TabBarContext";
import LinearGradient from "react-native-linear-gradient";
import { navigate, routesConstants } from "../../navigation";

const { width } = Dimensions.get("window");
const GRID_GAP = scales(3);
const HORIZONTAL_PADDING = scales(12);
const COLUMN_WIDTH = (width - HORIZONTAL_PADDING * 2 - GRID_GAP * 2) / 3;

const CAROUSEL_EVENTS = [
  {
    id: "e1",
    title: "Cannes Film Festival",
    subtitle: "Latest releases & premieres from indie creators",
    date: "Oct 24",
    image: { uri: "https://picsum.photos/seed/cannes_fest/800/500" },
    tag: "Festival",
  },
  {
    id: "e2",
    title: "Neon Dreams Premiere",
    subtitle: "Exclusive early access screening",
    date: "Nov 02",
    image: { uri: "https://picsum.photos/seed/neon_prem/800/500" },
    tag: "Premiere",
  },
  {
    id: "e3",
    title: "Creator Summit 2026",
    subtitle: "Connect with top global creators",
    date: "Dec 12",
    image: { uri: "https://picsum.photos/seed/creator_sum/800/500" },
    tag: "Event",
  },
];

const DUMMY_POSTS = Array.from({ length: 24 }, (_, i) => {
  const isVideo = i % 4 === 1;
  return {
    id: `post_${i}`,
    images: [
      { uri: `https://picsum.photos/seed/browse_grid_${i + 105}/500/500` },
    ],
    type: isVideo ? "project" : "post",
    description:
      "Living life one indiemate at a time 🌟 Grateful for the small moments that make everything worthwhile. #indiemate #community #love",
    likes: Math.floor(Math.random() * 900) + 50,
    comments: Math.floor(Math.random() * 100) + 2,
    shares: Math.floor(Math.random() * 50) + 1,
    postType: isVideo ? "project" : "slate",
    title: "Dhanda Empire",
  };
});

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export const Browse = () => {
  const insets = useSafeAreaInsets();
  const scrollHandler = useTabBarScrollHandler();
  const filterRef = useRef(null);
  const [search, setSearch] = useState("");

  const gridColumns = useMemo(() => {
    const cols = [[], [], []];

    DUMMY_POSTS.forEach((post, i) => {
      const colIdx = i % 3;
      cols[colIdx].push({
        ...post,
        height: 150,
      });
    });

    return cols;
  }, []);

  const renderCarouselItem = ({ item }) => {
    return (
      <View style={styles.carouselItem}>
        <Image source={item.image} style={styles.carouselImage} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.carouselGradient}
        />
        <View style={styles.carouselContent}>
          <View style={styles.carouselTagRow}>
            <View style={styles.carouselTag}>
              <Text style={styles.carouselTagText}>{item.tag}</Text>
            </View>
            <View style={styles.carouselDate}>
              <Text style={styles.carouselDateText}>{item.date}</Text>
            </View>
          </View>
          <Text style={styles.carouselTitle}>{item.title}</Text>
          <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  const renderGridItem = (item) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.gridTile, { height: item.height }]}
        activeOpacity={0.85}
        onPress={() => {
          if (item?.type === "project") {
            navigate(routesConstants.movie, { item });
          } else {
            navigate(routesConstants.post, {
              images: item.images,
              description: item.description,
              likes: item.likes,
              comments: item.comments,
              shares: item.shares,
            });
          }
        }}
      >
        <Image source={item.images[0]} style={styles.tileImage} />

        {item.type === "project" && (
          <View style={styles.badgeTopRight}>
            <Image
              source={appImages.play}
              style={styles.playBadgeIcon}
              tintColor={colors.white}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AnimatedScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingTop: insets.top }]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={styles.headerContent}>
          <View style={styles.searchRow}>
            <CustomSearch
              placeholder={commonText.search}
              value={search}
              onChangeText={setSearch}
              containerStyle={{
                flex: 1,
                paddingHorizontal: 0,
                paddingLeft: scales(16),
              }}
            />
            <RoundIconButton
              icon={appImages.filter}
              onPress={() => filterRef.current?.present()}
            />
          </View>
          <View style={styles.carouselContainer}>
            <CustomCarousel
              data={CAROUSEL_EVENTS}
              renderItem={renderCarouselItem}
            />
          </View>
        </View>

        <View style={styles.gridContainer}>
          {gridColumns.map((col, colIdx) => (
            <View key={`col_${colIdx}`} style={styles.gridColumn}>
              {col.map(renderGridItem)}
            </View>
          ))}
        </View>
      </AnimatedScrollView>

      <Filter
        ref={filterRef}
        onFilterChange={(filters) => console.log("Applied Filters:", filters)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContent: {
    paddingBottom: scales(10),
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: scales(16),
    gap: scales(12),
    marginBottom: scales(10),
  },
  listContent: {
    paddingBottom: scales(100),
  },
  carouselContainer: {
    marginTop: scales(10),
    alignItems: "center",
  },
  carouselItem: {
    width: "100%",
    height: scales(230),
    borderRadius: scales(24),
    overflow: "hidden",
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  carouselGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
  },
  carouselContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: scales(16),
  },
  carouselTagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scales(8),
  },
  carouselTag: {
    backgroundColor: colors.blue,
    paddingHorizontal: scales(10),
    paddingVertical: scales(4),
    borderRadius: scales(10),
  },
  carouselTagText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(10),
    textTransform: "uppercase",
  },
  carouselDate: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: scales(10),
    paddingVertical: scales(4),
    borderRadius: scales(10),
  },
  carouselDateText: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(11),
  },
  carouselTitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(22),
    marginBottom: scales(4),
  },
  carouselSubtitle: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
  },
  gridContainer: {
    flexDirection: "row",
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: GRID_GAP,
    marginTop: scales(12),
  },
  gridColumn: {
    flex: 1,
    flexDirection: "column",
    gap: GRID_GAP,
  },
  gridTile: {
    width: "100%",
    borderRadius: scales(6),
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
  badgeTopRight: {
    position: "absolute",
    top: scales(6),
    right: scales(6),
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: scales(4),
    padding: scales(4),
  },
  playBadgeIcon: {
    width: scales(10),
    height: scales(10),
    resizeMode: "contain",
  },
  tileStats: {
    position: "absolute",
    bottom: scales(6),
    left: scales(6),
    flexDirection: "row",
    alignItems: "center",
  },
  tileLikeIcon: {
    fontSize: scales(10),
    marginRight: scales(3),
  },
  tileLikeCount: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(10),
  },
});
