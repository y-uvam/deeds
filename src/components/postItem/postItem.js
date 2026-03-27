import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
} from "react-native";
import { useRef, useState } from "react";
import { BlurView } from "@react-native-community/blur";
import LottieView from "lottie-react-native";
import { colors, scales, width } from "../../utils";
import { ProfileComponent } from "../profileComponent/profileComponent";
import { useSelector } from "react-redux";
import { appImages, fontFamily } from "../../assets";
import { animations } from "../../animations/animations";
import { styles } from "./styles";
const ActionButton = ({ icon, iconStyle, count, onPress, activeColor }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [active, setActive] = useState(false);

  const handlePress = () => {
    const nextState = !active;
    setActive(nextState);
    if (onPress) onPress(nextState);
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.45,
        useNativeDriver: true,
        speed: 40,
        bounciness: 18,
      }),
      Animated.spring(scaleAnim, {
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
      <Animated.Image
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
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Image source={item} style={styles.postImage} resizeMode="cover" />
        )}
      />
      {images.length > 1 && (
        <View style={styles.badgeWrapper}>
          <BlurView style={styles.blurBadge} blurType="light" blurAmount={4}>
            <Text style={styles.badgeText}>
              {currentIndex + 1}/{images.length}
            </Text>
          </BlurView>
        </View>
      )}

      {images.length > 1 && (
        <View style={styles.dotsRow}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex && styles.dotActive]}
            />
          ))}
        </View>
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
      setTimeout(() => setShowLikeAnim(false), 2500); // hide automatically
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
      {/* Header */}
      <ProfileComponent
        userId={profileData?._id}
        name={profileData?.name}
        profileImage={profileData?.profileImage}
      />

      {/* Image(s) */}
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

      {/* Actions Row */}
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

      {/* Description */}
      <Description text={description} />
    </View>
  );
};
