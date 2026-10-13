import React, { useCallback } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import { appImages, fontFamily } from "../../assets";
import { colors, scales, topInset } from "../../utils";
import { navigate, replace } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";
import { animations } from "../../animations/animations";

const { width: SCREEN_W } = Dimensions.get("window");

const SLIDES = [
  {
    key: "creative",
    title: "The New Era of Storytelling",
    subtitle:
      "Escape the algorithm. A dedicated ecosystem to host, discover, and fund independent films.",
    bgImage: appImages.intro2,
    animation: animations.newEra,
  },
  {
    key: "together",
    title: "The Global Stage",
    subtitle:
      "Host digital premieres, submit your work to exclusive in-app film festivals, and cast your Projects directly to the big screen.",
    bgImage: appImages.intro3,
    animation: animations.global,
  },
  {
    key: "stage",
    title: "Build Your Legacy",
    subtitle:
      "Tag your crew, share the revenue. Every upload builds a verified visual resume, and every view funds the entire production team.",
    bgImage: appImages.intro1,
    animation: animations.yourLegacy,
  },
  {
    key: "network",
    title: "Network Without the Noise",
    subtitle:
      "Connect with filmmakers globally through real-time chat, collaborative project sharing, and daily cinematic challenges.",
    bgImage: appImages.poster1,
    animation: animations.noNoise,
  },
];

const SPRING_CFG = { damping: 20, stiffness: 150, mass: 0.8 };
const N = SLIDES.length;

const BackgroundImage = ({ index, image, scrollX }) => {
  const animStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [index - 1, index, index + 1],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scrollX.value,
      [index - 1, index, index + 1],
      [1.32, 1.25, 1.32],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.Image
      source={image}
      style={[StyleSheet.absoluteFillObject, styles.heroImage, animStyle]}
      resizeMode="cover"
    />
  );
};

const AnimatedBackground = ({ scrollX }) => (
  <View style={styles.heroContainer}>
    {SLIDES.map((slide, i) => (
      <BackgroundImage
        key={slide.key}
        index={i}
        image={slide.bgImage}
        scrollX={scrollX}
      />
    ))}
    <LinearGradient
      colors={["transparent", colors.background + "aa", colors.background]}
      locations={[0, 0.5, 1]}
      style={styles.gradientFade}
    />
  </View>
);

const Card = ({ slide, index, scrollX }) => {
  const { width } = useWindowDimensions();

  const cardStyle = useAnimatedStyle(() => {
    const pos = index - scrollX.value;
    const opacity = interpolate(
      pos,
      [-0.75, 0, 0.75],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      pos,
      [-1, 0, 1],
      [0.85, 1, 0.85],
      Extrapolation.CLAMP,
    );
    const translateX = interpolate(
      pos,
      [-1, 0, 1],
      [-width * 0.7, 0, width * 0.7],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
      transform: [{ translateX }, { scale }],
    };
  });

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.subtitle}>{slide.subtitle}</Text>
    </Animated.View>
  );
};

const Dot = ({ index, scrollX }) => {
  const style = useAnimatedStyle(() => {
    const pos = Math.abs(index - scrollX.value);
    return {
      width: interpolate(pos, [0, 1], [28, 8], Extrapolation.CLAMP),
      opacity: interpolate(pos, [0, 1], [1, 0.35], Extrapolation.CLAMP),
      backgroundColor: colors.white,
      transform: [
        { scale: interpolate(pos, [0, 1], [1, 0.8], Extrapolation.CLAMP) },
      ],
    };
  });
  return <Animated.View style={[styles.dot, style]} />;
};

const Dots = ({ scrollX }) => (
  <View style={styles.dotsRow}>
    {SLIDES.map((s, i) => (
      <Dot key={s.key} index={i} scrollX={scrollX} />
    ))}
  </View>
);

export const Intro = () => {
  const { width } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const startX = useSharedValue(0);

  const finish = useCallback(() => {
    navigate(routesConstants.Login);
  }, []);

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = scrollX.value;
    })
    .onUpdate((e) => {
      const delta = -e.translationX / width;
      let next = startX.value + delta;
      if (next < 0) next = next * 0.35;
      if (next > N - 1) next = N - 1 + (next - (N - 1)) * 0.35;
      scrollX.value = next;
    })
    .onEnd((e) => {
      const velocity = -e.velocityX / width;
      let target = Math.round(scrollX.value + velocity * 0.15);
      if (target < 0) target = 0;

      if (target > N - 1) {
        target = N - 1;
        scrollX.value = withSpring(target, SPRING_CFG);
        runOnJS(finish)();
        return;
      }

      scrollX.value = withSpring(target, SPRING_CFG);
    });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <AnimatedBackground scrollX={scrollX} />

      <GestureDetector gesture={pan}>
        <View style={styles.stage}>
          {SLIDES.map((slide, i) => (
            <Card key={slide.key} slide={slide} index={i} scrollX={scrollX} />
          ))}
        </View>
      </GestureDetector>

      <Dots scrollX={scrollX} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "64%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  gradientFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
  },
  stage: {
    flex: 1,
    // backgroundColor: "red",
  },
  card: {
    position: "absolute",
    left: scales(20),
    right: scales(20),
    bottom: scales(150),
    alignItems: "center",
  },
  title: {
    color: colors.white,
    fontSize: scales(25),
    fontFamily: fontFamily.bold,
    letterSpacing: 0.3,
    textAlign: "center",
    marginBottom: scales(12),
  },
  subtitle: {
    color: colors.transparentWhite40,
    fontSize: scales(15),
    fontFamily: fontFamily.regular,
    lineHeight: scales(22),
    textAlign: "center",
    maxWidth: SCREEN_W * 0.84,
  },
  dotsRow: {
    position: "absolute",
    bottom: scales(48) + topInset * 0.5,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scales(8),
  },
  dot: {
    height: scales(8),
    borderRadius: scales(4),
  },
});
