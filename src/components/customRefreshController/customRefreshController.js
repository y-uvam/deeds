import React from "react";
import { StyleSheet, View, Animated as RNAnimated } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  useEffect,
} from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import LottieView from "lottie-react-native";
import { colors, scales } from "../../utils";
import { appImages } from "../../assets";
import { animations } from "../../animations/animations";

export const CustomRefreshController = ({ scrollY, refreshing }) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (refreshing) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1500 }),
        -1,
        false,
      );
    } else {
      rotation.value = 0;
    }
  }, [refreshing]);

  const containerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [-100, -40, 0],
      [1, 0.5, 0],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollY.value,
      [-120, 0],
      [0, -120],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.4, 0.2],
      Extrapolation.CLAMP,
    );

    const rotate = refreshing ? `${rotation.value}deg` : "0deg";

    return {
      transform: [{ scale }, { rotate }],
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={15}
        reducedTransparencyFallbackColor="black"
      />
      <View style={styles.content}>
        <Animated.View style={[styles.iconWrapper, iconStyle]}>
          <Animated.Image
            source={appImages.appLogo}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        <LottieView
          source={animations.loading}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
      <View style={styles.separator} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: scales(100),
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  iconWrapper: {
    width: scales(50),
    height: scales(50),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: scales(25),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  logo: {
    width: scales(30),
    height: scales(30),
    tintColor: colors.white,
  },
  lottie: {
    width: scales(60),
    height: scales(20),
    position: "absolute",
    bottom: scales(10),
  },
  separator: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});
