import React, { useEffect, memo } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import { colors, topInset } from "../../utils";

const { width, height } = Dimensions.get("screen");
const BLUE = colors.blue;

const PulseRing = memo(({ delay, size }) => {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.12, { duration: 600 }),
          withTiming(0, { duration: 2400 }),
        ),
        -1,
        false,
      ),
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.out(Easing.ease) }),
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BLUE,
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={style} />;
});

const FloatingOrb = memo(({ x, y, size, delay }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.06, { duration: 2000 }),
          withTiming(0.02, { duration: 2000 }),
        ),
        -1,
        true,
      ),
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.6, {
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1,
        false,
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
    backgroundColor: BLUE,
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={style} />;
});

const orbs = [
  { x: -60, y: height * 0.1, size: 220, delay: 0 },
  { x: width - 100, y: height * 0.35, size: 180, delay: 1200 },
  { x: width * 0.2, y: height * 0.7, size: 160, delay: 600 },
  { x: width * 0.6, y: height * 0.85, size: 200, delay: 1800 },
];

export const AppBackground = ({ children, style, isTopInset = true }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#010A1A", "#000510", "#000000"]}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.ringLayer}>
        <PulseRing delay={0} size={width * 1.4} />
        <PulseRing delay={1000} size={width * 1.9} />
        <PulseRing delay={2000} size={width * 2.4} />
      </View>

      {orbs.map((orb, i) => (
        <FloatingOrb key={i} {...orb} />
      ))}

      <View
        style={[
          styles.content,
          { paddingTop: isTopInset ? topInset : 0, ...style },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    overflow: "hidden",
  },
  ringLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
});
