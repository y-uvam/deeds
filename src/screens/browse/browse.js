import React, { useState, useRef } from "react";
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

const CAROUSEL_EVENTS = [
  {
    id: "e1",
    title: "Cannes Film Festival",
    subtitle: "Latest releases & premieres from indie creators",
    date: "Oct 24",
    image: appImages.post,
    tag: "Festival",
  },
  {
    id: "e2",
    title: "Neon Dreams Premiere",
    subtitle: "Exclusive early access screening",
    date: "Nov 02",
    image: appImages.post,
    tag: "Premiere",
  },
  {
    id: "e3",
    title: "Creator Summit 2026",
    subtitle: "Connect with top global creators",
    date: "Dec 12",
    image: appImages.post,
    tag: "Event",
  },
];

const DUMMY_POSTS = Array.from({ length: 16 }, (_, i) => {
  return {
    id: `post_${i}`,
    images: [appImages.post], // Passing an array of images to match PostItem props
    description:
      "Living life one deed at a time 🌟 Grateful for the small moments that make everything worthwhile. #deeds #community #love",
    likes: Math.floor(Math.random() * 1000) + 10,
    comments: Math.floor(Math.random() * 100) + 2,
    shares: Math.floor(Math.random() * 50) + 1,
    height: i % 3 === 0 ? scales(280) : i % 2 === 0 ? scales(180) : scales(220),
  };
});

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export const Browse = () => {
  const insets = useSafeAreaInsets();
  const scrollHandler = useTabBarScrollHandler();
  const filterRef = useRef(null);
  const [search, setSearch] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

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

  const renderPost = (item, index) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.masonryItem, { height: item.height }]}
        activeOpacity={0.9}
        onPress={() =>
          navigate(routesConstants.post, {
            images: item.images,
            description: item.description,
            likes: item.likes,
            comments: item.comments,
            shares: item.shares,
          })
        }
      >
        <Image source={item.images[0]} style={styles.masonryImage} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={styles.masonryGradient}
        />
        <View style={styles.masonryStats}>
          <Text style={styles.masonryLikeIcon}>❤️</Text>
          <Text style={styles.masonryLikeCount}>{item.likes}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const leftColumn = DUMMY_POSTS.filter((_, i) => i % 2 === 0);
  const rightColumn = DUMMY_POSTS.filter((_, i) => i % 2 !== 0);

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

        {/* <View style={[styles.feedHeader, { backgroundColor: 'red', marginTop: scales(30) }]}>
          <Text style={styles.feedTitle}>EXPLORE POSTS</Text>
        </View> */}
        <View style={styles.masonryContainer}>
          <View style={styles.masonryColumn}>{leftColumn.map(renderPost)}</View>
          <View style={styles.masonryColumn}>
            {rightColumn.map(renderPost)}
          </View>
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
  paginationContainer: {
    paddingVertical: scales(10),
  },
  paginationDot: {
    width: scales(24),
    height: scales(6),
    borderRadius: scales(3),
    backgroundColor: colors.white,
  },
  paginationInactiveDot: {
    width: scales(8),
    height: scales(8),
    borderRadius: scales(4),
    backgroundColor: colors.transparentWhite40,
  },
  feedHeader: {
    paddingHorizontal: scales(16),
    marginTop: scales(10),
    marginBottom: scales(16),
  },
  feedTitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(20),
  },
  masonryContainer: {
    flexDirection: "row",
    paddingHorizontal: scales(12),
    gap: scales(12),
  },
  masonryColumn: {
    flex: 1,
    flexDirection: "column",
    gap: scales(12),
  },
  masonryItem: {
    width: "100%",
    marginBottom: scales(16),
    borderRadius: scales(16),
    overflow: "hidden",
    backgroundColor: colors.transparentWhite5,
  },
  masonryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  masonryGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  masonryStats: {
    position: "absolute",
    bottom: scales(12),
    left: scales(12),
    flexDirection: "row",
    alignItems: "center",
  },
  masonryLikeIcon: {
    fontSize: scales(12),
    marginRight: scales(4),
  },
  masonryLikeCount: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(12),
  },
});
