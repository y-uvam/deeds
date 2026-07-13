import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated as RNNAnimated,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import LottieView from "lottie-react-native";
import { colors, commonText, scales, width } from "../../utils";
import { ProfileComponent } from "../../components/profileComponent/profileComponent";
import { useSelector } from "react-redux";
import { appImages, fontFamily } from "../../assets";
import { animations } from "../../animations/animations";
import { goBack } from "../../navigation/navigationServices";
import { AppBackground, Header } from "../../components";

const DOT_SIZE = scales(6);
const DOT_ACTIVE_WIDTH = scales(18);

const AnimatedDot = ({ index, currentIndex }) => {
  const dotWidth = useSharedValue(
    index === currentIndex ? DOT_ACTIVE_WIDTH : DOT_SIZE,
  );
  const dotOpacity = useSharedValue(
    index === currentIndex
      ? 1
      : Math.abs(index - currentIndex) === 1
      ? 0.4
      : 0.2,
  );
  const dotScale = useSharedValue(
    index === currentIndex
      ? 1
      : Math.abs(index - currentIndex) <= 1
      ? 0.85
      : 0.7,
  );

  React.useEffect(() => {
    const dist = Math.abs(index - currentIndex);
    const active = index === currentIndex;
    dotWidth.value = withSpring(active ? DOT_ACTIVE_WIDTH : DOT_SIZE, {
      damping: 15,
      stiffness: 120,
    });
    dotOpacity.value = withTiming(active ? 1 : dist === 1 ? 0.4 : 0.2, {
      duration: 250,
    });
    dotScale.value = withSpring(active ? 1 : dist <= 1 ? 0.85 : 0.7, {
      damping: 14,
      stiffness: 100,
    });
  }, [currentIndex]);

  const style = useAnimatedStyle(() => ({
    width: dotWidth.value,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.white,
    opacity: dotOpacity.value,
    transform: [{ scale: dotScale.value }],
    marginHorizontal: 2,
  }));

  return <Animated.View style={style} />;
};

const SlideItem = ({ item, index, scrollX }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const animStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.95, 1, 0.95],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolation.CLAMP,
    );
    return { transform: [{ scale }], opacity };
  });

  return (
    <Animated.View style={[{ width, overflow: "hidden" }, animStyle]}>
      <Image source={item} style={styles.postImage} resizeMode="cover" />
    </Animated.View>
  );
};

const ImageCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const onScroll = useCallback((e) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  }, []);

  const visibleDots =
    images.length <= 7
      ? images
      : images.slice(
          Math.max(0, Math.min(currentIndex - 3, images.length - 7)),
          Math.max(7, Math.min(currentIndex + 4, images.length)),
        );

  if (!images.length) return null;

  return (
    <View style={{ position: "relative" }}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        bounces={false}
        renderItem={({ item, index }) => (
          <SlideItem item={item} index={index} scrollX={scrollX} />
        )}
      />

      {images.length > 1 && (
        <>
          <View style={styles.badgeWrapper}>
            <BlurView
              style={styles.blurBadge}
              blurType="dark"
              blurAmount={12}
              reducedTransparencyFallbackColor="#000"
            >
              <View style={styles.badgeInner}>
                <Text style={styles.badgeText}>
                  {currentIndex + 1}
                  <Text style={styles.badgeSeparator}> / </Text>
                  {images.length}
                </Text>
              </View>
            </BlurView>
          </View>

          <View style={styles.dotsRow}>
            <BlurView
              style={styles.dotsBlur}
              blurType="dark"
              blurAmount={10}
              reducedTransparencyFallbackColor="#000"
            >
              <View style={styles.dotsInner}>
                {visibleDots.map((_, i) => {
                  const realIndex =
                    images.length <= 7
                      ? i
                      : Math.max(
                          0,
                          Math.min(currentIndex - 3, images.length - 7),
                        ) + i;
                  return (
                    <AnimatedDot
                      key={realIndex}
                      index={realIndex}
                      currentIndex={currentIndex}
                      total={images.length}
                    />
                  );
                })}
              </View>
            </BlurView>
          </View>
        </>
      )}
    </View>
  );
};

const ActionButton = ({ icon, iconStyle, count, onPress, activeColor }) => {
  const scaleAnim = useRef(new RNNAnimated.Value(1)).current;
  const [active, setActive] = useState(false);

  const handlePress = () => {
    const nextState = !active;
    setActive(nextState);
    if (onPress) onPress(nextState);
    RNNAnimated.sequence([
      RNNAnimated.spring(scaleAnim, {
        toValue: 1.45,
        useNativeDriver: true,
        speed: 40,
        bounciness: 18,
      }),
      RNNAnimated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 10,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.actionContainer}
      activeOpacity={0.8}
    >
      <RNNAnimated.Image
        source={icon}
        style={[
          iconStyle,
          {
            transform: [{ scale: scaleAnim }],
            tintColor: active && activeColor ? activeColor : undefined,
          },
        ]}
      />
      {count !== undefined && (
        <Text style={styles.actionText}>{active ? count + 1 : count}</Text>
      )}
    </TouchableOpacity>
  );
};

export const Post = ({ route }) => {
  const profileData = useSelector((state) => state.persist.profileData);
  const [showLikeAnim, setShowLikeAnim] = useState(false);
  const [showSaveAnim, setShowSaveAnim] = useState(false);

  const {
    images = [appImages.post],
    description = "Living life one deed at a time 🌟 Grateful for the small moments that make everything worthwhile.",
    likes = 248,
    comments = 36,
    shares = 12,
  } = route?.params || {};

  const handleLikePress = (isActive) => {
    if (isActive) {
      setShowLikeAnim(true);
      setTimeout(() => setShowLikeAnim(false), 2500);
    }
  };

  const handleSavePress = (isActive) => {
    if (isActive) {
      setShowSaveAnim(true);
      setTimeout(() => setShowSaveAnim(false), 2500);
    }
  };

  return (
    <AppBackground>
      <Header label={commonText.posts} showBackButton={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile */}
        <View style={styles.profileRow}>
          <ProfileComponent
            userId={profileData?._id}
            name={profileData?.name}
            profileImage={profileData?.profileImage}
          />
        </View>

        {/* Image Carousel */}
        <View style={styles.carouselWrapper}>
          <ImageCarousel images={images} />
          {showLikeAnim && (
            <LottieView
              source={animations.like}
              autoPlay
              loop={false}
              style={styles.animOverlay}
            />
          )}
          {showSaveAnim && (
            <LottieView
              source={animations.save}
              autoPlay
              loop={false}
              style={styles.animOverlay}
            />
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <View style={styles.actionsLeft}>
            <ActionButton
              icon={appImages.like}
              iconStyle={styles.iconLike}
              count={likes}
              activeColor={colors.red}
              onPress={handleLikePress}
            />
            <ActionButton
              icon={appImages.comment}
              iconStyle={styles.iconComment}
              count={comments}
            />
            <ActionButton
              icon={appImages.share}
              iconStyle={styles.iconShare}
              count={shares}
            />
          </View>
          <ActionButton
            icon={appImages.save}
            iconStyle={styles.iconSave}
            activeColor={colors.blue}
            onPress={handleSavePress}
          />
        </View>

        {/* Full Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white || "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scales(16),
    paddingVertical: scales(12),
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  backBtn: {
    padding: scales(6),
  },
  backIcon: {
    width: scales(22),
    height: scales(22),
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: scales(17),
    fontFamily: fontFamily?.semiBold || "System",
    color: colors.black || "#000",
  },
  headerRight: {
    width: scales(34),
  },
  scrollContent: {
    paddingBottom: scales(40),
  },
  profileRow: {
    paddingHorizontal: scales(16),
    paddingTop: scales(12),
  },
  carouselWrapper: {
    marginTop: scales(10),
    position: "relative",
  },
  postImage: {
    width: width,
    height: width,
  },
  animOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scales(16),
    paddingVertical: scales(10),
  },
  actionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(16),
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(4),
  },
  actionText: {
    fontSize: scales(13),
    fontFamily: fontFamily?.medium || "System",
    color: colors.white,
  },
  iconLike: {
    width: scales(22),
    height: scales(22),
    resizeMode: "contain",
  },
  iconComment: {
    width: scales(22),
    height: scales(22),
    resizeMode: "contain",
  },
  iconShare: {
    width: scales(22),
    height: scales(22),
    resizeMode: "contain",
  },
  iconSave: {
    width: scales(22),
    height: scales(22),
    resizeMode: "contain",
  },
  descriptionContainer: {
    paddingHorizontal: scales(16),
    paddingTop: scales(4),
    paddingBottom: scales(20),
  },
  descriptionText: {
    fontSize: scales(14),
    fontFamily: fontFamily?.regular || "System",
    color: colors.white,
    lineHeight: scales(22),
  },
  // carousel badge/dots
  badgeWrapper: {
    position: "absolute",
    top: scales(12),
    right: scales(12),
    borderRadius: scales(12),
    overflow: "hidden",
  },
  blurBadge: {
    borderRadius: scales(12),
  },
  badgeInner: {
    paddingHorizontal: scales(10),
    paddingVertical: scales(4),
  },
  badgeText: {
    color: "#fff",
    fontSize: scales(12),
    fontFamily: fontFamily?.semiBold || "System",
  },
  badgeSeparator: {
    opacity: 0.6,
  },
  dotsRow: {
    position: "absolute",
    bottom: scales(12),
    left: 0,
    right: 0,
    alignItems: "center",
  },
  dotsBlur: {
    borderRadius: scales(16),
  },
  dotsInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scales(10),
    paddingVertical: scales(6),
  },
});
