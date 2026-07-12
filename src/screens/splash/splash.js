import React, { useEffect, useCallback } from "react";
import { View, StyleSheet, Dimensions, StatusBar, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { routesConstants } from "../../navigation/routeConstants";
import { colors, scales } from "../../utils";
import { DataManager } from "../../helper/dataManager";
import { appImages } from "../../assets/icons/appImages";
import { fontFamily } from "../../assets";

const { width, height } = Dimensions.get("screen");

export const Splash = () => {
  const navigation = useNavigation();

  // Logo animations
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.85);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(10);

  // Exit animation
  const masterOpacity = useSharedValue(1);

  const navigateNextStep = useCallback(async () => {
    const userData = await DataManager.getUserDetails();
    masterOpacity.value = withTiming(0, { duration: 500 }, (done) => {
      if (done) {
        runOnJS(navigation.replace)(
          userData?.email ? routesConstants.BottomTabs : routesConstants.Login
        );
      }
    });
  }, []);

  useEffect(() => {
    // Logo fades + scales in
    logoOpacity.value = withTiming(1, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
    logoScale.value = withSpring(1, { damping: 18, stiffness: 80 });

    // Tagline slides up shortly after
    taglineOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    taglineY.value = withDelay(
      400,
      withSpring(0, { damping: 20, stiffness: 90 })
    );

    // Navigate after 2.2s total
    const timer = setTimeout(navigateNextStep, 2200);
    return () => clearTimeout(timer);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: masterOpacity.value,
    flex: 1,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <Animated.View style={[StyleSheet.absoluteFill, containerStyle]}>
        {/* Background */}
        <View style={styles.bg} />

        {/* Subtle top accent line */}
        <View style={styles.accentLine} />

        {/* Center content */}
        <View style={styles.center}>
          <Animated.View style={logoStyle}>
            <Image
              source={appImages.appLogo}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.Text style={[styles.appName, logoStyle]}>
            virtue
          </Animated.Text>

          <Animated.Text style={[styles.tagline, taglineStyle]}>
            Connect. Share. Inspire.
          </Animated.Text>
        </View>

        {/* Bottom brand dot */}
        <Animated.View style={[styles.bottomDot, taglineStyle]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#050A14",
    width,
    height,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#050A14",
  },
  accentLine: {
    position: "absolute",
    top: 0,
    left: "20%",
    right: "20%",
    height: 2,
    backgroundColor: colors.blue,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    opacity: 0.7,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: scales(8),
  },
  logo: {
    width: scales(64),
    height: scales(64),
    tintColor: colors.white,
  },
  appName: {
    color: colors.white,
    fontSize: scales(34),
    fontFamily: fontFamily.bold,
    letterSpacing: 6,
    marginTop: scales(4),
  },
  tagline: {
    color: "rgba(255,255,255,0.45)",
    fontSize: scales(13),
    fontFamily: fontFamily.regular,
    letterSpacing: 2,
    marginTop: scales(6),
    textTransform: "uppercase",
  },
  bottomDot: {
    alignSelf: "center",
    width: scales(5),
    height: scales(5),
    borderRadius: scales(3),
    backgroundColor: colors.blue,
    marginBottom: scales(50),
    opacity: 0.6,
  },
});
