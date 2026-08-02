import React, { memo, useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  Pressable,
  Share,
  Animated as RnAnimated,
} from "react-native";
import Video from "react-native-video";
import LottieView from "lottie-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "@react-native-community/blur";
import { useNavigation } from "@react-navigation/native";
import { routesConstants } from "../../navigation";
import { appImages, fontFamily } from "../../assets";
import { animations } from "../../animations/animations";
import { colors, scales } from "../../utils";
import { showCustomMessage } from "../../helper/FlashMessage";
import { CommentSheet } from "../commentSheet/commentSheet";
import { CustomBottomSheet } from "../customBottomSheet/customBottomSheet";

const { width: W, height: H } = Dimensions.get("window");

const ListItem = ({ image, label, onPress, isDestructive }) => (
  <TouchableOpacity
    style={styles.listItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Image
      source={image}
      style={[
        styles.listIcon,
        isDestructive && { tintColor: colors.lightRed },
      ]}
      tintColor={isDestructive ? colors.lightRed : colors.white}
    />
    <Text
      style={[
        styles.listText,
        isDestructive && { color: colors.lightRed },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export const ReelItem = memo(({ item, isActive, isMuted, onToggleMute }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes || 124);
  const [saved, setSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showLikeAnim, setShowLikeAnim] = useState(false);
  const [showSaveAnim, setShowSaveAnim] = useState(false);

  const commentSheetRef = useRef(null);
  const moreSheetRef = useRef(null);
  const fadeAnim = useRef(new RnAnimated.Value(0)).current;

  const handlePressVideo = () => {
    onToggleMute();
    fadeAnim.setValue(1);
    RnAnimated.sequence([
      RnAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      RnAnimated.delay(500),
      RnAnimated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressLike = useCallback(() => {
    if (!liked) {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      setShowLikeAnim(true);
      setTimeout(() => setShowLikeAnim(false), 1500);
    } else {
      setLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
    }
  }, [liked]);

  const handleSave = useCallback(() => {
    if (!saved) {
      setSaved(true);
      setShowSaveAnim(true);
      setTimeout(() => setShowSaveAnim(false), 1500);
    } else {
      setSaved(false);
    }
  }, [saved]);

  const handleSharePost = useCallback(async () => {
    try {
      await Share.share({
        message: `Check out this reel on IndieMate!`,
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  }, []);

  const handleFollow = useCallback(() => {
    setIsFollowing((prev) => {
      const nextState = !prev;
      showCustomMessage(
        nextState ? "Following creator" : "Unfollowed creator",
        nextState ? "success" : "info"
      );
      return nextState;
    });
  }, []);

  const handleProfilePress = useCallback(() => {
    navigation.navigate(routesConstants.Profile);
  }, [navigation]);

  return (
    <View style={styles.container}>
        <Pressable onPress={handlePressVideo} style={StyleSheet.absoluteFill}>
          {isActive && (
            <Video
              source={{ uri: item.videoUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              repeat
              paused={!isActive}
              muted={isMuted}
              playInBackground={false}
              playWhenInactive={false}
              ignoreSilentSwitch="ignore"
            />
          )}
        </Pressable>

        {showLikeAnim && (
          <LottieView
            source={animations.like}
            autoPlay
            loop={false}
            style={styles.likeAnimCorner}
          />
        )}
        {showSaveAnim && (
          <LottieView
            source={animations.save}
            autoPlay
            loop={false}
            style={styles.saveAnimCorner}
          />
        )}

        <View
          style={[styles.topProfileContainer, { top: insets.top + scales(0) }]}
        >
          <BlurView
            style={[StyleSheet.absoluteFill, styles.blurView]}
            blurType="dark"
            blurAmount={5}
            reducedTransparencyFallbackColor={colors.background}
          />
          <TouchableOpacity
            style={styles.profileClickArea}
            onPress={handleProfilePress}
            activeOpacity={0.8}
          >
            <Image source={appImages.dummyuser} style={styles.profileImage} />
            <View style={styles.topProfileText}>
              <Text style={styles.username}>
                {item.username || "creator_username"}
              </Text>
              <Text style={styles.musicText}>Original Audio</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.followButton,
              isFollowing && styles.followingButton,
            ]}
            onPress={handleFollow}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.followText,
                isFollowing && styles.followingText,
              ]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.bottomContainer,
            { bottom: insets.bottom + scales(80) },
          ]}
        >
          <Text style={styles.caption} numberOfLines={2}>
            {item.caption ||
              "This is a gorgeous placeholder caption for the reel! #wellness #growth"}
          </Text>

          <View style={styles.floatingActionBarContainer}>
            <View style={styles.floatingActionBar}>
              <TouchableOpacity
                onPress={handlePressLike}
                style={styles.horizontalActionButton}
              >
                <Image
                  source={appImages.heart}
                  style={[
                    styles.actionIcon,
                    liked && { tintColor: colors.red },
                  ]}
                />
                <Text style={styles.actionText}>{likesCount}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => commentSheetRef.current?.present()}
                style={styles.horizontalActionButton}
              >
                <Image source={appImages.comment} style={styles.actionIcon} />
                <Text style={styles.actionText}>{item.comments || 45}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSharePost}
                style={styles.horizontalActionButton}
              >
                <Image source={appImages.send} style={styles.actionIcon} />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => moreSheetRef.current?.present()}
                style={styles.horizontalActionButton}
              >
                <Image source={appImages.threeDots} style={styles.actionIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <RnAnimated.View
          style={[styles.muteIndicatorContainer, { opacity: fadeAnim }]}
          pointerEvents="none"
        >
          <View style={styles.muteIndicatorCircle}>
            <Image
              source={isMuted ? appImages.play : appImages.pause}
              style={styles.play}
            />
          </View>
        </RnAnimated.View>

        <CommentSheet ref={commentSheetRef} />
        <CustomBottomSheet
          ref={moreSheetRef}
          snapPoints={["54%"]}
          useBlur={true}
          enablePanDownToClose={true}
          enableBackdrop={true}
          showCloseButton={true}
          title="Reel Options"
          subtitle="Select an action for this reel"
        >
          <View style={styles.listItemContainer}>
            <ListItem
              image={appImages.info}
              label="Full Details"
              onPress={() => {
                moreSheetRef.current?.dismiss();
                navigation.navigate(routesConstants.movie);
              }}
            />
            <ListItem
              image={saved ? appImages.saved : appImages.save}
              label={saved ? "Remove from Saved" : "Save Reel"}
              onPress={() => {
                handleSave();
                moreSheetRef.current?.dismiss();
                showCustomMessage(
                  saved ? "Removed from saved reels" : "Saved to your library",
                  "success"
                );
              }}
            />
            <ListItem
              image={appImages.send}
              label="Share Reel"
              onPress={() => {
                moreSheetRef.current?.dismiss();
                handleSharePost();
              }}
            />
            <ListItem
              image={appImages.copy}
              label="Copy Link"
              onPress={() => {
                moreSheetRef.current?.dismiss();
                showCustomMessage("Reel link copied to clipboard", "info");
              }}
            />
            <ListItem
              image={appImages.follow}
              label="Follow Creator"
              onPress={() => {
                moreSheetRef.current?.dismiss();
                showCustomMessage("Followed creator", "success");
              }}
            />
            <ListItem
              image={appImages.bell}
              label="Mute Creator"
              onPress={() => {
                moreSheetRef.current?.dismiss();
                showCustomMessage("Muted creator reels", "info");
              }}
            />
            <ListItem
              image={appImages.blocked}
              label="Block User"
              isDestructive={true}
              onPress={() => {
                moreSheetRef.current?.dismiss();
                showCustomMessage("Blocked user", "danger");
              }}
            />
            <ListItem
              image={appImages.report}
              label="Report Reel"
              isDestructive={true}
              onPress={() => {
                moreSheetRef.current?.dismiss();
                showCustomMessage(
                  "Report submitted. Thank you for keeping IndieMate safe.",
                  "danger"
                );
              }}
            />
          </View>
        </CustomBottomSheet>
      </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: W,
    height: H,
    backgroundColor: colors.black,
  },
  likeAnimCorner: {
    position: "absolute",
    bottom: scales(140),
    left: scales(10),
    width: scales(120),
    height: scales(120),
    zIndex: 99,
    pointerEvents: "none",
  },
  saveAnimCorner: {
    position: "absolute",
    bottom: scales(140),
    right: scales(10),
    width: scales(120),
    height: scales(120),
    zIndex: 99,
    pointerEvents: "none",
  },
  topProfileContainer: {
    position: "absolute",
    left: scales(16),
    right: scales(16),
    flexDirection: "row",
    alignItems: "center",
    padding: scales(8),
    borderRadius: scales(25),
    paddingRight: scales(16),
    overflow: "hidden",
  },
  blurView: {
    borderRadius: scales(25),
  },
  profileImage: {
    width: scales(40),
    height: scales(40),
    borderRadius: scales(20),
    borderWidth: 1.5,
    borderColor: colors.white,
    marginRight: scales(10),
  },
  topProfileText: {
    flex: 1,
    justifyContent: "center",
  },
  username: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(14),
  },
  musicText: {
    color: colors.white,
    fontFamily: fontFamily.medium,
    fontSize: scales(11),
    opacity: 0.8,
    marginTop: scales(2),
  },
  profileClickArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  followButton: {
    backgroundColor: colors.white,
    borderRadius: scales(15),
    paddingHorizontal: scales(14),
    paddingVertical: scales(6),
  },
  followingButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  followText: {
    color: colors.black,
    fontFamily: fontFamily.bold,
    fontSize: scales(12),
  },
  followingText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(12),
  },
  bottomContainer: {
    position: "absolute",
    left: scales(16),
    right: scales(16),
    gap: scales(16),
  },
  caption: {
    color: colors.white,
    fontFamily: fontFamily.regular,
    fontSize: scales(14),
    lineHeight: scales(20),
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  floatingActionBarContainer: {
    borderRadius: scales(30),
    overflow: "hidden",
  },
  floatingActionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scales(24),
    paddingVertical: scales(12),
  },
  horizontalActionButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: scales(6),
  },
  actionIcon: {
    width: scales(22),
    height: scales(22),
    tintColor: colors.white,
    resizeMode: "contain",
  },
  actionText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(13),
  },
  muteIndicatorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  muteIndicatorCircle: {
    width: scales(70),
    height: scales(70),
    borderRadius: scales(35),
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  play: {
    width: scales(28),
    height: scales(28),
    tintColor: colors.white,
  },
  listItemContainer: {
    paddingVertical: scales(10),
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scales(14),
  },
  listIcon: {
    width: scales(22),
    height: scales(22),
    marginRight: scales(14),
    resizeMode: "contain",
  },
  listText: {
    color: colors.white,
    fontSize: scales(16),
    fontFamily: fontFamily.medium,
  },
});
