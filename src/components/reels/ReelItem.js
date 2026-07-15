import React, { memo, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  Pressable,
  Animated as RnAnimated,
} from "react-native";
import Video from "react-native-video";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "@react-native-community/blur";
import { useNavigation, StackActions } from "@react-navigation/native";
import {
  FlingGestureHandler,
  Directions,
  State,
} from "react-native-gesture-handler";
import { routesConstants } from "../../navigation";
import { appImages, fontFamily } from "../../assets";
import { colors, scales } from "../../utils";

const { width: W, height: H } = Dimensions.get("window");

export const ReelItem = memo(({ item, isActive, isMuted, onToggleMute }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes || 124);
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

  const handlePressLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const onFling = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      navigation.dispatch(StackActions.push(routesConstants.Profile));
    }
  };

  return (
    <FlingGestureHandler
      direction={Directions.LEFT}
      onHandlerStateChange={onFling}
    >
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

        <View
          style={[styles.topProfileContainer, { top: insets.top + scales(0) }]}
        >
          <BlurView
            style={[StyleSheet.absoluteFill, styles.blurView]}
            blurType="dark"
            blurAmount={5}
            reducedTransparencyFallbackColor={colors.background}
          />
          <Image source={appImages.dummyuser} style={styles.profileImage} />
          <View style={styles.topProfileText}>
            <Text style={styles.username}>
              {item.username || "creator_username"}
            </Text>
            <Text style={styles.musicText}>Original Audio</Text>
          </View>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followText}>Follow</Text>
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

              <TouchableOpacity style={styles.horizontalActionButton}>
                <Image source={appImages.comment} style={styles.actionIcon} />
                <Text style={styles.actionText}>{item.comments || 45}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.horizontalActionButton}>
                <Image source={appImages.send} style={styles.actionIcon} />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.horizontalActionButton}>
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
              src={isMuted ? appImages.play : appImages.pause}
              style={styles.play}
            />
          </View>
        </RnAnimated.View>
      </View>
    </FlingGestureHandler>
  );
});

const styles = StyleSheet.create({
  container: {
    width: W,
    height: H,
    backgroundColor: colors.black,
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
  followButton: {
    backgroundColor: colors.white,
    borderRadius: scales(15),
    paddingHorizontal: scales(12),
    paddingVertical: scales(6),
  },
  followText: {
    color: colors.black,
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
    width: scales(24),
    height: scales(24),
    tintColor: colors.white,
  },
  actionText: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(13),
  },
  muteIndicatorContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  muteIndicatorCircle: {
    width: scales(64),
    height: scales(64),
    borderRadius: scales(32),
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  muteIndicatorText: {
    fontSize: scales(28),
  },
  play: {
    height: scales(20),
    width: scales(20),
    tintColor: colors.gray,
  },
});
