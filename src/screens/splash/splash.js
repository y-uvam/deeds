import React, { useEffect, memo, useCallback } from "react";
import { View, StyleSheet, Dimensions, StatusBar } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  Easing,
  runOnJS,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { routesConstants } from "../../navigation/routeConstants";
import { colors } from "../../utils";
import { DataManager } from "../../helper/dataManager";
import { appImages } from "../../assets/icons/appImages";

const { width, height } = Dimensions.get("screen");

const PulseRing = memo(({ delay, size }) => {
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.25, { duration: 400 }),
          withTiming(0, { duration: 1800 }),
        ),
        -1,
        false,
      ),
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 2200, easing: Easing.out(Easing.quad) }),
        -1,
        false,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 1,
    borderColor: colors.white,
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={style} />;
});

const Particle = memo(({ index }) => {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    const angle = (index / 18) * Math.PI * 2;
    const radius = 90 + Math.random() * 60;
    const delay = 1200 + index * 80;

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: 500 }),
          withTiming(0, { duration: 1500 }),
        ),
        -1,
        false,
      ),
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 1500 }),
        ),
        -1,
        false,
      ),
    );
    tx.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(Math.cos(angle) * radius, {
            duration: 2000,
            easing: Easing.out(Easing.cubic),
          }),
          withTiming(0, { duration: 0 }),
        ),
        -1,
        false,
      ),
    );
    ty.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(Math.sin(angle) * radius, {
            duration: 2000,
            easing: Easing.out(Easing.cubic),
          }),
          withTiming(0, { duration: 0 }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.white,
    opacity: opacity.value,
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: scale.value },
    ],
  }));

  return <Animated.View style={style} />;
});

const AnimatedLetter = memo(({ image, index, totalLetters, onComplete }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const shimmer = useSharedValue(0);

  const targetX = (index - (totalLetters - 1) / 2) * 44;

  useEffect(() => {
    const d = 600 + index * 90;

    scale.value = withDelay(d, withSpring(1, { damping: 12, stiffness: 90 }));
    opacity.value = withDelay(d, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(
      d,
      withSpring(0, { damping: 14, stiffness: 70 }),
    );
    shimmer.value = withDelay(
      d + 400,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0, { duration: 1200 }),
        ),
        -1,
        false,
      ),
    );

    if (index === totalLetters - 1) {
      setTimeout(() => onComplete?.(), d + 2800);
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: targetX },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
    position: "absolute",
  }));

  const tintStyle = useAnimatedStyle(() => ({
    tintColor: interpolateColor(
      shimmer.value,
      [0, 1],
      [colors.white, colors.white],
    ),
  }));

  return (
    <View style={styles.letterHub}>
      <Animated.Image
        source={image}
        style={[styles.letterAsset, animatedStyle, tintStyle]}
        resizeMode="contain"
      />
    </View>
  );
});

export const Splash = () => {
  const navigation = useNavigation();
  const masterOpacity = useSharedValue(1);
  const masterScale = useSharedValue(1);
  const lineWidth = useSharedValue(0);
  const lineOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  const letters = [
    appImages.v,
    appImages.i,
    appImages.r,
    appImages.t,
    appImages.u,
    appImages.e,
  ];

  useEffect(() => {
    glowOpacity.value = withDelay(300, withTiming(1, { duration: 1200 }));
    lineWidth.value = withDelay(
      2200,
      withSpring(1, { damping: 18, stiffness: 35 }),
    );
    lineOpacity.value = withDelay(2200, withTiming(1, { duration: 600 }));
  }, []);

  const navigateNextStep = useCallback((userData) => {
    navigation.replace(
      userData?.email ? routesConstants.BottomTabs : routesConstants.Login,
    );
  }, []);

  const handleFinishSequence = useCallback(async () => {
    const userData = await DataManager.getUserDetails();
    masterOpacity.value = withTiming(0, { duration: 700 });
    masterScale.value = withTiming(
      1.08,
      { duration: 900, easing: Easing.inOut(Easing.quad) },
      (done) => {
        if (done) runOnJS(navigateNextStep)(userData);
      },
    );
  }, []);

  const overallStyle = useAnimatedStyle(() => ({
    opacity: masterOpacity.value,
    transform: [{ scale: masterScale.value }],
    flex: 1,
  }));

  const lineStyle = useAnimatedStyle(() => ({
    width: interpolate(lineWidth.value, [0, 1], [0, width * 0.65]),
    opacity: lineOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <Animated.View style={[StyleSheet.absoluteFill, overallStyle]}>
        <LinearGradient
          colors={["#000000", "#010A1A", "#000510", "#000000"]}
          locations={[0, 0.3, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />

        <Animated.View style={[styles.radialCore, glowStyle]}>
          <LinearGradient
            colors={["#001833", "transparent"]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <View style={styles.center}>
          <PulseRing delay={800} size={220} />
          <PulseRing delay={1400} size={320} />
          <PulseRing delay={2000} size={430} />

          {Array.from({ length: 18 }).map((_, i) => (
            <Particle key={i} index={i} />
          ))}

          <View style={styles.letterContainer}>
            {letters.map((img, i) => (
              <AnimatedLetter
                key={i}
                image={img}
                index={i}
                totalLetters={letters.length}
                onComplete={
                  i === letters.length - 1 ? handleFinishSequence : undefined
                }
              />
            ))}
          </View>

          <View style={styles.lineWrapper}>
            <Animated.View style={[styles.glowLine, lineStyle]} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
    width,
    height,
  },
  radialCore: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  letterContainer: {
    height: 80,
    width,
    alignItems: "center",
    justifyContent: "center",
  },
  letterHub: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  letterAsset: {
    width: 38,
    height: 52,
  },
  lineWrapper: {
    marginTop: 40,
    alignItems: "center",
  },
  glowLine: {
    height: 1.5,
    backgroundColor: colors.white,
    borderRadius: 1,
    shadowColor: colors.white,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
});
