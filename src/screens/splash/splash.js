import React, { useEffect, useCallback } from "react";
import { View, StyleSheet, Dimensions, StatusBar, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { routesConstants } from "../../navigation/routeConstants";
import { colors, scales } from "../../utils";
import { DataManager } from "../../helper/dataManager";
import { appImages } from "../../assets/icons/appImages";
import { fontFamily } from "../../assets";
import { animations } from "../../animations/animations";

const { width, height } = Dimensions.get("screen");

const LETTERS = [
  appImages.v,
  appImages.i,
  appImages.r,
  appImages.t,
  appImages.u,
  appImages.e,
];

const PARTICLES = [
  { x: width * 0.1, y: height * 0.15, delay: 800, size: 3 },
  { x: width * 0.85, y: height * 0.12, delay: 1100, size: 2 },
  { x: width * 0.05, y: height * 0.45, delay: 600, size: 2 },
  { x: width * 0.92, y: height * 0.55, delay: 950, size: 3 },
  { x: width * 0.2, y: height * 0.78, delay: 700, size: 2 },
  { x: width * 0.75, y: height * 0.82, delay: 1200, size: 2.5 },
  { x: width * 0.5, y: height * 0.08, delay: 850, size: 2 },
  { x: width * 0.38, y: height * 0.88, delay: 1050, size: 3 },
  { x: width * 0.65, y: height * 0.22, delay: 750, size: 2 },
  { x: width * 0.15, y: height * 0.65, delay: 900, size: 2.5 },
];

const AnimatedLetter = ({ source, index, totalDelay }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.4);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const delay = totalDelay + index * 80;
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }),
    );
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 120 }),
    );
    translateY.value = withDelay(
      delay,
      withSpring(0, { damping: 14, stiffness: 100 }),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.letterWrapper, style]}>
      <Image source={source} style={styles.letterImage} resizeMode="contain" />
    </Animated.View>
  );
};

const GlowOrb = ({
  delay = 0,
  size,
  top,
  left,
  color,
  opacity: maxOpacity = 0.18,
}) => {
  const orbOpacity = useSharedValue(0);
  const orbScale = useSharedValue(0.7);

  useEffect(() => {
    orbOpacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(maxOpacity, {
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(maxOpacity * 0.4, {
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        true,
      ),
    );
    orbScale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.85, {
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    top: top - size / 2,
    left: left - size / 2,
    opacity: orbOpacity.value,
    transform: [{ scale: orbScale.value }],
  }));

  return <Animated.View style={style} />;
};

const ScanLine = ({ startDelay }) => {
  const scanY = useSharedValue(-height * 0.1);
  const scanOpacity = useSharedValue(0);

  useEffect(() => {
    scanOpacity.value = withDelay(startDelay, withTiming(1, { duration: 200 }));
    scanY.value = withDelay(
      startDelay,
      withTiming(height, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: scanY.value,
    height: 1.5,
    opacity: scanOpacity.value,
  }));

  return (
    <Animated.View style={style}>
      <View style={styles.scanLineInner} />
    </Animated.View>
  );
};

const Particle = ({ x, y, delay, size = 2 }) => {
  const particleOpacity = useSharedValue(0);
  const particleScale = useSharedValue(0);

  useEffect(() => {
    particleOpacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: 600 }),
          withTiming(0.1, { duration: 1200 }),
        ),
        -1,
        true,
      ),
    );
    particleScale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withSpring(1, { damping: 10, stiffness: 80 }),
          withTiming(0.3, { duration: 1000 }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    left: x,
    top: y,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: colors.blue,
    opacity: particleOpacity.value,
    transform: [{ scale: particleScale.value }],
  }));

  return <Animated.View style={style} />;
};

const PulseRing = ({ delay, size }) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.35, { duration: 300 }),
          withTiming(0, { duration: 1400 }),
        ),
        -1,
        false,
      ),
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 1700, easing: Easing.out(Easing.ease) }),
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
    borderWidth: 1.5,
    borderColor: colors.blue,
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
    alignSelf: "center",
  }));

  return <Animated.View style={style} />;
};

export const Splash = () => {
  const navigation = useNavigation();
  const isLoggedIn = useSelector((state) => state.persist?.isLoggedIn);

  const masterOpacity = useSharedValue(1);
  const logoAreaScale = useSharedValue(0.8);
  const logoAreaOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(14);
  const lineWidth = useSharedValue(0);
  const lineOpacity = useSharedValue(0);
  const dotScale = useSharedValue(0);
  const dotOpacity = useSharedValue(0);
  const versionOpacity = useSharedValue(0);

  const navigateNextStep = useCallback(() => {
    masterOpacity.value = withTiming(0, { duration: 1000 }, (done) => {
      if (done) {
        runOnJS(navigation.replace)(
          isLoggedIn ? routesConstants.BottomTabs : routesConstants.intro,
        );
      }
    });
  }, [isLoggedIn, navigation]);

  useEffect(() => {
    logoAreaOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
    logoAreaScale.value = withSpring(1, { damping: 16, stiffness: 80 });
    taglineOpacity.value = withDelay(
      900,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
    );
    taglineY.value = withDelay(
      900,
      withSpring(0, { damping: 18, stiffness: 90 }),
    );
    lineWidth.value = withDelay(
      1000,
      withSpring(width * 0.55, { damping: 22, stiffness: 60 }),
    );
    lineOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));
    dotScale.value = withDelay(
      1200,
      withSpring(1, { damping: 10, stiffness: 120 }),
    );
    dotOpacity.value = withDelay(1200, withTiming(0.8, { duration: 300 }));
    versionOpacity.value = withDelay(1300, withTiming(0.35, { duration: 600 }));

    const timer = setTimeout(navigateNextStep, 2800);
    return () => clearTimeout(timer);
  }, [navigateNextStep]);

  const masterStyle = useAnimatedStyle(() => ({
    opacity: masterOpacity.value,
    flex: 1,
  }));
  const logoAreaStyle = useAnimatedStyle(() => ({
    opacity: logoAreaOpacity.value,
    transform: [{ scale: logoAreaScale.value }],
  }));

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <Animated.View style={[StyleSheet.absoluteFill, masterStyle]}>
        <LottieView
          source={animations.background}
          autoPlay
          loop
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <View style={styles.overlay} />

        <GlowOrb
          size={width * 0.6}
          top={height * 0.7}
          left={width * 0.15}
          color="#7C3AED"
          opacity={0.1}
          delay={400}
        />
        <GlowOrb
          size={width * 0.5}
          top={height * 0.15}
          left={width * 0.85}
          color={colors.blue}
          opacity={0.08}
          delay={700}
        />

        <ScanLine startDelay={200} />

        {PARTICLES.map((p, i) => (
          <Particle key={i} x={p.x} y={p.y} delay={p.delay} size={p.size} />
        ))}

        <View style={styles.center}>
          <Animated.View style={[styles.logoArea, logoAreaStyle]}>
            <View style={styles.ringContainer}>
              <PulseRing delay={600} size={scales(140)} />
              <PulseRing delay={1050} size={scales(190)} />
              <Image
                source={appImages.appLogo}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          <View style={styles.lettersRow}>
            {LETTERS.map((img, i) => (
              <AnimatedLetter key={i} source={img} index={i} totalDelay={400} />
            ))}
          </View>

          {/* <Animated.Text style={[styles.tagline, taglineStyle]}>
            Connect · Share · Inspire
          </Animated.Text> */}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width,
    height,
    backgroundColor: colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 20, 36, 0.72)",
  },
  topAccent: {
    position: "absolute",
    top: 0,
    left: "15%",
    right: "15%",
    height: scales(2),
    backgroundColor: colors.blue,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    opacity: 0.8,
    shadowColor: colors.blue,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
  },
  bottomAccent: {
    position: "absolute",
    bottom: 0,
    left: "30%",
    right: "30%",
    height: scales(1.5),
    backgroundColor: colors.blue,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    opacity: 0.5,
  },
  scanLineInner: {
    flex: 1,
    backgroundColor: colors.blue,
    opacity: 0.12,
    shadowColor: colors.blue,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: scales(6),
  },
  logoArea: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: scales(8),
  },
  ringContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: scales(100),
    height: scales(100),
  },
  logo: {
    width: scales(72),
    height: scales(72),
    tintColor: colors.white,
    position: "absolute",
    shadowColor: colors.blue,
    shadowOpacity: 0.8,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  lettersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: scales(6),
  },
  letterWrapper: {
    marginHorizontal: scales(2),
  },
  letterImage: {
    width: scales(26),
    height: scales(36),
    tintColor: colors.white,
  },
  decorLine: {
    height: scales(1),
    backgroundColor: colors.blue,
    borderRadius: 1,
    marginTop: scales(14),
    opacity: 0.7,
    shadowColor: colors.blue,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  tagline: {
    color: "rgba(255,255,255,0.5)",
    fontSize: scales(11),
    fontFamily: fontFamily.regular,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginTop: scales(10),
  },
  bottomArea: {
    alignItems: "center",
    paddingBottom: scales(48),
    gap: scales(10),
  },
  bottomDot: {
    width: scales(6),
    height: scales(6),
    borderRadius: scales(3),
    backgroundColor: colors.blue,
    shadowColor: colors.blue,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  versionText: {
    color: colors.white,
    fontSize: scales(10),
    fontFamily: fontFamily.regular,
    letterSpacing: 2,
  },
});
