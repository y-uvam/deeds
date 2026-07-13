import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Path,
} from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 70;
const STROKE = 6;
const RADIUS = 27;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const SplashLogo = () => {
  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2500,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    progress.value = withRepeat(
      withTiming(1, {
        duration: 1800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE - progress.value * CIRCUMFERENCE * 0.75,
  }));

  return (
    <View style={styles.container}>
      {/* V */}
      <Svg width={SIZE} height={SIZE} viewBox="0 0 64 64">
        <Defs>
          <LinearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#973BED" />
            <Stop offset="100%" stopColor="#007CFF" />
          </LinearGradient>
        </Defs>

        <Path
          d="M14 10 L32 54 L50 10"
          stroke="url(#grad1)"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>

      {/* Animated Ring */}
      <Animated.View
        style={[
          styles.rotate,
          {
            transform: [
              {
                rotate: `${rotation.value}deg`,
              },
            ],
          },
        ]}
      >
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <LinearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFC800" />
              <Stop offset="100%" stopColor="#FF00FF" />
            </LinearGradient>
          </Defs>

          <AnimatedCircle
            animatedProps={animatedProps}
            cx="35"
            cy="35"
            r={RADIUS}
            stroke="url(#grad2)"
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>

      {/* VIRTUE */}
      <Text style={styles.text}>VIRTUE</Text>

      {/* U */}
      <Svg width={SIZE} height={SIZE} viewBox="0 0 64 64">
        <Defs>
          <LinearGradient id="grad3" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#00E0ED" />
            <Stop offset="100%" stopColor="#00DA72" />
          </LinearGradient>
        </Defs>

        <Path
          d="M16 10 V35 C16 48 24 54 32 54 C40 54 48 48 48 35 V10"
          stroke="url(#grad3)"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rotate: {
    position: "absolute",
  },
  text: {
    marginHorizontal: 10,
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 4,
  },
});
