import React, { useRef, useState, useCallback } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
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
import { colors, scales, width } from "../../utils";
import { useSelector } from "react-redux";
import { appImages, fontFamily } from "../../assets";
import { animations } from "../../animations/animations";
import { navigate } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";
import { styles } from "./styles";
import { Spacer } from "../spacer/spacer";

const DOT_SIZE = scales(5);
const DOT_ACTIVE_WIDTH = scales(16);

const AnimatedDot = ({ index, currentIndex }) => {
  const isActive = index === currentIndex;
  const dotWidth = useSharedValue(isActive ? DOT_ACTIVE_WIDTH : DOT_SIZE);
  const dotOpacity = useSharedValue(
    isActive ? 1 : Math.abs(index - currentIndex) === 1 ? 0.4 : 0.2,
  );

  React.useEffect(() => {
    const active = index === currentIndex;
    const dist = Math.abs(index - currentIndex);
    dotWidth.value = withSpring(active ? DOT_ACTIVE_WIDTH : DOT_SIZE, {
      damping: 15,
      stiffness: 120,
    });
    dotOpacity.value = withTiming(active ? 1 : dist === 1 ? 0.4 : 0.2, {
      duration: 250,
    });
  }, [currentIndex]);

  const style = useAnimatedStyle(() => ({
    width: dotWidth.value,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.white,
    opacity: dotOpacity.value,
    marginHorizontal: scales(2),
  }));

  return <Animated.View style={style} />;
};

const ActionButton = ({ icon, count, onPress, active, activeColor, label }) => {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.82, { damping: 20, stiffness: 300 }),
      withSpring(1, { damping: 14, stiffness: 200 }),
    );
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.actionBtn}
      activeOpacity={0.9}
    >
      <Animated.Image
        source={icon}
        style={[
          styles.actionIcon,
          animatedStyle,
          active && activeColor
            ? { tintColor: activeColor }
            : { tintColor: colors.white },
        ]}
        resizeMode="contain"
      />
      {(count !== undefined || label) && (
        <Text style={styles.actionLabel}>{label ?? count}</Text>
      )}
    </TouchableOpacity>
  );
};

const SlideItem = ({ item, index, scrollX, onDoubleTap }) => {
  const lastTap = useRef(0);
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);

  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const animStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.96, 1, 0.96],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.65, 1, 0.65],
      Extrapolation.CLAMP,
    );
    return { transform: [{ scale }], opacity };
  });

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      heartScale.value = withSequence(
        withSpring(1.4, { damping: 8, stiffness: 120 }),
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 400 }),
      );
      heartOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(1, { duration: 400 }),
        withTiming(0, { duration: 300 }),
      );
      onDoubleTap?.();
    }
    lastTap.current = now;
  };

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.slideWrapper}>
        <Animated.View style={[styles.imageContainer, animStyle]}>
          <Image source={item} style={styles.postImage} resizeMode="cover" />
        </Animated.View>
        <Animated.View
          style={[styles.heartOverlay, heartStyle]}
          pointerEvents="none"
        >
          <Text style={styles.heartEmoji}>❤️</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const ImageCarousel = ({ images = [], onDoubleTap }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef(null);

  const onScroll = useCallback((e) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
    setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  }, []);

  if (!images.length) return null;

  return (
    <View>
      <FlatList
        ref={flatListRef}
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
          <SlideItem
            item={item}
            index={index}
            scrollX={scrollX}
            onDoubleTap={onDoubleTap}
          />
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
                {images.map((_, i) => (
                  <AnimatedDot key={i} index={i} currentIndex={currentIndex} />
                ))}
              </View>
            </BlurView>
          </View>
        </>
      )}
    </View>
  );
};

const Description = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const isTruncatable = text?.length > 100;

  return (
    <View style={styles.descriptionContainer}>
      <Text
        style={styles.descriptionText}
        numberOfLines={expanded ? undefined : 2}
      >
        {text}
      </Text>
      {isTruncatable && (
        <TouchableOpacity onPress={() => setExpanded((p) => !p)}>
          <Text style={styles.viewMoreText}>
            {expanded ? "View less" : "View more"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const PostItem = ({
  images = [appImages.post],
  description = "Living life one deed at a time 🌟 Grateful for the small moments that make everything worthwhile.",
  likes = 248,
  comments = 36,
  shares = 12,
}) => {
  const profileData = useSelector((state) => state.persist.profileData);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showLikeAnim, setShowLikeAnim] = useState(false);
  const [showSaveAnim, setShowSaveAnim] = useState(false);

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    if (next) {
      setShowLikeAnim(true);
      setTimeout(() => setShowLikeAnim(false), 2500);
    }
  };

  const handleSave = () => {
    const next = !saved;
    setSaved(next);
    if (next) {
      setShowSaveAnim(true);
      setTimeout(() => setShowSaveAnim(false), 2500);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.97}
      onPress={() =>
        navigate(routesConstants.post, {
          images,
          description,
          likes,
          comments,
          shares,
        })
      }
    >
      <View style={styles.card}>
        <View style={styles.profileHeader}>
          <TouchableOpacity
            style={styles.profileLeft}
            onPress={() => navigate(routesConstants.Profile)}
            activeOpacity={0.8}
          >
            <View style={styles.avatarRing}>
              <Image
                source={profileData?.profileImage || appImages.dummyuser}
                style={styles.avatar}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {profileData?.name || "Yuvam Dhanda"}
              </Text>
              <Text style={styles.profileMeta}>Just now · 🌍</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Description text={description} />

        <View>
          <ImageCarousel images={images} onDoubleTap={handleLike} />
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
              style={[
                styles.animOverlay,
                { right: scales(20), left: undefined },
              ]}
            />
          )}
        </View>

        <Spacer height={scales(20)} />
        <View style={styles.actionBarWrapper}>
          <View style={styles.actionBarInner}>
            <ActionButton
              icon={appImages.heart}
              count={liked ? likes + 1 : likes}
              active={liked}
              activeColor={colors.red}
              onPress={handleLike}
            />
            <View style={styles.actionDivider} />
            <ActionButton
              icon={appImages.comment}
              count={comments}
              onPress={() => {}}
            />
            <View style={styles.actionDivider} />
            <ActionButton
              icon={appImages.send}
              label="Share"
              onPress={() => {}}
            />
            <View style={styles.actionDivider} />
            <ActionButton icon={appImages.threeDots} onPress={() => {}} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
