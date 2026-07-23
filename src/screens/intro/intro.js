import React, { useState, useCallback, useRef } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { animations } from "../../animations/animations";
import { appImages, fontFamily } from "../../assets";
import { colors, scales, topInset } from "../../utils";
import { replace } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";

const { width: SCREEN_W } = Dimensions.get("window");

const SLIDES = [
  {
    id: 1,
    title: "Your Creative\nUniverse Awaits",
    subtitle:
      "Discover a world where every story becomes something extraordinary.",
  },
  {
    id: 2,
    title: "Create Together,\nShine Together",
    subtitle:
      "Connect with directors, producers, and artists who share your vision.",
  },
  {
    id: 3,
    title: "Your Stage.\nYour Story.",
    subtitle:
      "Step into the spotlight. Share bites, projects, and slates with an audience ready to be moved.",
  },
];

const DOT_INACTIVE = scales(7);
const DOT_ACTIVE = scales(22);

const AnimatedDot = ({ index, dotProgress }) => {
  const animStyle = useAnimatedStyle(() => {
    const dist = Math.max(0, 1 - Math.abs(dotProgress.value - index));
    return {
      width: DOT_INACTIVE + dist * (DOT_ACTIVE - DOT_INACTIVE),
      backgroundColor: interpolateColor(
        dist,
        [0, 1],
        [colors.transparentWhite15, colors.blue],
      ),
    };
  });

  return <Animated.View style={[styles.dot, animStyle]} />;
};

export const Intro = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const indexRef = useRef(0);

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const dotProgress = useSharedValue(0);

  const bringInContent = useCallback(
    (nextIndex, fromRight = true) => {
      translateX.value = fromRight ? SCREEN_W * 0.08 : -SCREEN_W * 0.08;
      opacity.value = 0;
      dotProgress.value = withTiming(nextIndex, {
        duration: 380,
        easing: Easing.inOut(Easing.ease),
      });
      translateX.value = withSpring(0, { damping: 20, stiffness: 120 });
      opacity.value = withTiming(1, { duration: 400 });
      setIsAnimating(false);
    },
    [translateX, opacity, dotProgress],
  );

  const goForward = useCallback(() => {
    const next = indexRef.current + 1;
    if (next >= SLIDES.length) {
      replace(routesConstants.Login);
      return;
    }
    indexRef.current = next;
    setSlideIndex(next);
    bringInContent(next, true);
  }, [bringInContent]);

  const goBack = useCallback(() => {
    const next = indexRef.current - 1;
    indexRef.current = next;
    setSlideIndex(next);
    bringInContent(next, false);
  }, [bringInContent]);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    translateX.value = withTiming(-SCREEN_W * 0.06, { duration: 240 });
    opacity.value = withTiming(0, { duration: 240 }, (done) => {
      if (done) runOnJS(goForward)();
    });
  }, [isAnimating, translateX, opacity, goForward]);

  const handleBack = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    translateX.value = withTiming(SCREEN_W * 0.06, { duration: 240 });
    opacity.value = withTiming(0, { duration: 240 }, (done) => {
      if (done) runOnJS(goBack)();
    });
  }, [isAnimating, translateX, opacity, goBack]);

  const handleGetStarted = useCallback(() => {
    replace(routesConstants.Login);
  }, []);

  const animatedContent = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const slide = SLIDES[slideIndex] ?? SLIDES[0];
  const isLast = slideIndex === SLIDES.length - 1;

  return (
    <View style={styles.root}>
      <LottieView
        source={animations.background}
        autoPlay
        loop
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <View style={styles.content}>
        {slideIndex > 0 && (
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={handleBack}
          >
            <Image
              style={{ height: 15, width: 15 }}
              source={appImages.backarrow}
              tintColor={colors.white}
            />
          </TouchableOpacity>
        )}

        <View style={styles.spacer} />

        <Animated.View style={[styles.textBlock, animatedContent]}>
          <Text style={styles.title}>{slide.title}</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
        </Animated.View>

        <View style={styles.bottomArea}>
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <AnimatedDot key={i} index={i} dotProgress={dotProgress} />
            ))}
          </View>

          <TouchableOpacity
            style={styles.circleBtn}
            activeOpacity={0.82}
            onPress={isLast ? handleGetStarted : handleNext}
          >
            <Image
              source={appImages.backarrow}
              style={styles.circleBtnArrow}
              tintColor={colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(4,12,26,0.68)",
  },
  content: {
    flex: 1,
    paddingTop: topInset + scales(24),
    paddingHorizontal: scales(28),
    paddingBottom: scales(44),
  },
  backBtn: {
    alignSelf: "flex-start",
    width: scales(38),
    height: scales(38),
    borderRadius: scales(19),
    backgroundColor: colors.transparentWhite8,
    borderWidth: 1,
    borderColor: colors.transparentWhite12,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.bold,
    fontSize: scales(18),
  },
  spacer: {
    flex: 1,
  },
  textBlock: {
    marginBottom: scales(48),
  },
  title: {
    color: colors.white,
    fontFamily: fontFamily.black,
    fontSize: scales(38),
    lineHeight: scales(47),
    marginBottom: scales(16),
  },
  divider: {
    width: scales(36),
    height: 2,
    backgroundColor: colors.blue,
    borderRadius: 2,
    marginBottom: scales(16),
    opacity: 0.85,
  },
  subtitle: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(15),
    lineHeight: scales(24),
    maxWidth: SCREEN_W * 0.78,
  },
  bottomArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(8),
  },
  dot: {
    height: scales(7),
    borderRadius: scales(4),
  },
  circleBtn: {
    width: scales(54),
    height: scales(54),
    borderRadius: scales(27),
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  circleBtnArrow: {
    resizeMode: "contain",
    tintColor: colors.white,
    height: scales(18),
    width: scales(18),
    transform: [{ rotate: "180deg" }],
  },
});
