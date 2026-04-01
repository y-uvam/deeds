import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  Animated as RNNAnimated,
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
import { ProfileComponent } from "../profileComponent/profileComponent";
import { useSelector } from "react-redux";
import { appImages, fontFamily } from "../../assets";
import { animations } from "../../animations/animations";
import { styles } from "./styles";

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

const DOT_SIZE = scales(6);
const DOT_ACTIVE_WIDTH = scales(18);

const AnimatedDot = ({ index, currentIndex, total }) => {
  const distance = Math.abs(index - currentIndex);
  const isActive = index === currentIndex;

  const dotWidth = useSharedValue(isActive ? DOT_ACTIVE_WIDTH : DOT_SIZE);
  const dotOpacity = useSharedValue(isActive ? 1 : distance === 1 ? 0.4 : 0.2);
  const dotScale = useSharedValue(isActive ? 1 : distance <= 1 ? 0.85 : 0.7);

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

const SlideItem = ({ item, index, scrollX, onDoubleTap }) => {
  const lastTap = useRef(0);
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);

  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const animStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.92, 1, 0.92],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
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
        withSpring(1.3, { damping: 8, stiffness: 120 }),
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
          <View style={styles.imageEdgeFade} pointerEvents="none" />
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

const ImageCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef(null);

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
    <View style={styles.root}>
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

const Description = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 100;
  const isTruncatable = text?.length > LIMIT;

  return (
    <View style={styles.descriptionContainer}>
      <Text
        style={styles.descriptionText}
        numberOfLines={expanded ? undefined : 2}
      >
        {text}
      </Text>
      {isTruncatable && (
        <TouchableOpacity onPress={() => setExpanded((prev) => !prev)}>
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
  description = "Living life one deed at a time 🌟 Grateful for the small moments that make everything worthwhile. Life is beautiful when you choose to see the good in everything around you.",
  likes = 248,
  comments = 36,
  shares = 12,
}) => {
  const profileData = useSelector((state) => state.persist.profileData);

  const [showLikeAnim, setShowLikeAnim] = useState(false);
  const [showSaveAnim, setShowSaveAnim] = useState(false);

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
    <View style={styles.container}>
      <ProfileComponent
        userId={profileData?._id}
        name={profileData?.name}
        profileImage={profileData?.profileImage}
      />

      <View style={{ marginTop: scales(10), position: "relative" }}>
        <ImageCarousel images={images} />
        {showLikeAnim && (
          <LottieView
            source={animations.like}
            autoPlay
            loop={false}
            style={styles.animLikeOverlay}
          />
        )}
        {showSaveAnim && (
          <LottieView
            source={animations.save}
            autoPlay
            loop={false}
            style={styles.animSaveOverlay}
          />
        )}
      </View>

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

      <Description text={description} />
    </View>
  );
};
