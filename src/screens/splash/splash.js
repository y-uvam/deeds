import React, { useEffect, useCallback } from "react";
import { StyleSheet, Dimensions, StatusBar, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { routesConstants } from "../../navigation/routeConstants";
import { AppBackground } from "../../components";
import { colors } from "../../utils";
import { tokenManager } from "../../helper/createMMKV";

const { width } = Dimensions.get("window");
const AnimatedSvgPath = Animated.createAnimatedComponent(Path);

const PATHS_DATA = [
  {
    id: "i1",
    start: 0.0,
    end: 0.0611,
    length: 135.5,
    d: "M 14.95,72.88 Q 14.95,75.06 13.52,76.53 Q 12.1,78 9.91,78 Q 7.73,78 6.3,76.53 Q 4.87,75.06 4.87,72.88 L 4.87,20.96 Q 4.87,18.78 6.3,17.31 Q 7.73,15.84 9.91,15.84 Q 12.1,15.84 13.52,17.31 Q 14.95,18.78 14.95,20.96 L 14.95,72.88",
  },
  {
    id: "n1",
    start: 0.0611,
    end: 0.1643,
    length: 230.4,
    d: "M 49.31,32.22 Q 55.52,32.22 58.76,34.82 Q 61.99,37.43 63.21,41.75 Q 64.43,46.08 64.43,51.37 L 64.43,72.88 Q 64.43,75.06 63,76.53 Q 61.57,78 59.39,78 Q 57.2,78 55.78,76.53 Q 54.35,75.06 54.35,72.88 L 54.35,51.37 Q 54.35,48.6 53.63,46.37 Q 52.92,44.15 51.07,42.8 Q 49.22,41.46 45.78,41.46 Q 42.42,41.46 40.11,42.8 Q 37.8,44.15 36.58,46.37 Q 35.36,48.6 35.36,51.37 L 35.36,72.88 Q 35.36,75.06 33.94,76.53 Q 32.51,78 30.32,78 Q 28.14,78 26.71,76.53 Q 25.28,75.06 25.28,72.88 L 25.28,38.18 Q 25.28,36 26.71,34.53 Q 28.14,33.06 30.32,33.06 Q 32.51,33.06 33.94,34.53 Q 35.36,36 35.36,38.18 L 35.36,41.8 L 34.1,41.54 Q 34.86,40.12 36.29,38.48 Q 37.72,36.84 39.65,35.41 Q 41.58,33.98 44.02,33.1 Q 46.45,32.22 49.31,32.22",
  },
  {
    id: "d1",
    start: 0.1643,
    end: 0.3026,
    length: 308.6,
    d: "M 112.14,15.84 Q 114.32,15.84 115.75,17.27 Q 117.18,18.7 117.18,20.96 L 117.18,72.88 Q 117.18,75.06 115.75,76.53 Q 114.32,78 112.14,78 Q 109.96,78 108.53,76.53 Q 107.1,75.06 107.1,72.88 L 107.1,68.76 L 108.95,69.52 Q 108.95,70.61 107.77,72.16 Q 106.6,73.72 104.58,75.23 Q 102.56,76.74 99.83,77.79 Q 97.1,78.84 93.91,78.84 Q 88.12,78.84 83.41,75.86 Q 78.71,72.88 75.98,67.63 Q 73.25,62.38 73.25,55.57 Q 73.25,48.68 75.98,43.43 Q 78.71,38.18 83.33,35.2 Q 87.95,32.22 93.58,32.22 Q 97.19,32.22 100.21,33.31 Q 103.24,34.4 105.46,36.08 Q 107.69,37.76 108.91,39.49 Q 110.12,41.21 110.12,42.38 L 107.1,43.48 L 107.1,20.96 Q 107.1,18.78 108.53,17.31 Q 109.96,15.84 112.14,15.84 M 95.17,69.6 Q 98.87,69.6 101.64,67.75 Q 104.41,65.9 105.97,62.71 Q 107.52,59.52 107.52,55.57 Q 107.52,51.54 105.97,48.35 Q 104.41,45.16 101.64,43.31 Q 98.87,41.46 95.17,41.46 Q 91.56,41.46 88.79,43.31 Q 86.02,45.16 84.46,48.35 Q 82.91,51.54 82.91,55.57 Q 82.91,59.52 84.46,62.71 Q 86.02,65.9 88.79,67.75 Q 91.56,69.6 95.17,69.6",
  },
  {
    id: "i2",
    start: 0.3026,
    end: 0.3637,
    length: 136.3,
    d: "M 137.59,72.88 Q 137.59,75.06 136.16,76.53 Q 134.74,78 132.55,78 Q 130.37,78 128.94,76.53 Q 127.51,75.06 127.51,72.88 L 127.51,38.18 Q 127.51,36 128.94,34.53 Q 130.37,33.06 132.55,33.06 Q 134.74,33.06 136.16,34.53 Q 137.59,36 137.59,38.18 L 137.59,72.88 M 132.47,27.6 Q 129.61,27.6 128.44,26.68 Q 127.26,25.75 127.26,23.4 L 127.26,21.8 Q 127.26,19.37 128.56,18.49 Q 129.86,17.6 132.55,17.6 Q 135.49,17.6 136.67,18.53 Q 137.84,19.45 137.84,21.8 L 137.84,23.4 Q 137.84,25.84 136.58,26.72 Q 135.32,27.6 132.47,27.6",
  },
  {
    id: "e1",
    start: 0.3637,
    end: 0.4931,
    length: 288.6,
    d: "M 169.09,78.84 Q 161.95,78.84 156.7,75.86 Q 151.45,72.88 148.64,67.75 Q 145.82,62.63 145.82,56.16 Q 145.82,48.6 148.89,43.27 Q 151.96,37.93 156.91,35.08 Q 161.87,32.22 167.41,32.22 Q 171.7,32.22 175.52,33.98 Q 179.34,35.75 182.28,38.81 Q 185.22,41.88 186.94,45.91 Q 188.66,49.94 188.66,54.48 Q 188.58,56.5 187.07,57.76 Q 185.56,59.02 183.54,59.02 L 151.45,59.02 L 148.93,50.62 L 179.76,50.62 L 177.91,52.3 L 177.91,50.03 Q 177.74,47.59 176.19,45.66 Q 174.64,43.73 172.33,42.59 Q 170.02,41.46 167.41,41.46 Q 164.89,41.46 162.71,42.13 Q 160.52,42.8 158.93,44.4 Q 157.33,46 156.41,48.68 Q 155.48,51.37 155.48,55.49 Q 155.48,60.02 157.37,63.17 Q 159.26,66.32 162.25,67.96 Q 165.23,69.6 168.59,69.6 Q 171.7,69.6 173.54,69.1 Q 175.39,68.59 176.53,67.88 Q 177.66,67.16 178.58,66.66 Q 180.1,65.9 181.44,65.9 Q 183.29,65.9 184.51,67.16 Q 185.72,68.42 185.72,70.1 Q 185.72,72.37 183.37,74.22 Q 181.19,76.07 177.24,77.45 Q 173.29,78.84 169.09,78.84",
  },
  {
    id: "m1",
    start: 0.4931,
    end: 0.6547,
    length: 476.0,
    d: "M 197.48,72.88 L 197.48,20.96 Q 197.48,18.78 198.91,17.31 Q 200.34,15.84 202.52,15.84 L 228.0,70.0 Q 230.75,76.5 233.5,70.0 L 258.98,15.84 Q 261.16,15.84 262.58,17.31 Q 264.01,18.78 264.01,20.96 L 264.01,72.88 Q 264.01,75.06 262.58,76.53 Q 261.16,78 258.97,78 Q 256.79,78 255.36,76.53 Q 253.93,75.06 253.93,72.88 L 253.93,19.0 L 233.5,52.3 Q 230.75,57.1 228.0,52.3 L 207.56,19.0 L 207.56,72.88 Q 207.56,75.06 206.14,76.53 Q 204.71,78 202.52,78 Q 200.34,78 198.91,76.53 Q 197.48,75.06 197.48,72.88",
  },
  {
    id: "a1",
    start: 0.6547,
    end: 0.7783,
    length: 275.8,
    d: "M 311.72,32.22 Q 313.91,32.22 315.34,33.65 Q 316.76,35.08 316.76,37.34 L 316.76,72.88 Q 316.76,75.06 315.34,76.53 Q 313.91,78 311.72,78 Q 309.54,78 308.11,76.53 Q 306.68,75.06 306.68,72.88 L 306.68,68.76 L 308.53,69.52 Q 308.53,70.61 307.36,72.16 Q 306.18,73.72 304.16,75.23 Q 302.15,76.74 299.42,77.79 Q 296.69,78.84 293.5,78.84 Q 287.7,78.84 283,75.86 Q 278.29,72.88 275.56,67.63 Q 272.83,62.38 272.83,55.57 Q 272.83,48.68 275.56,43.43 Q 278.29,38.18 282.91,35.2 Q 287.53,32.22 293.16,32.22 Q 296.77,32.22 299.8,33.31 Q 302.82,34.4 305.05,36.08 Q 307.27,37.76 308.49,39.49 Q 309.71,41.21 309.71,42.38 L 306.68,43.48 L 306.68,37.34 Q 306.68,35.16 308.11,33.69 Q 309.54,32.22 311.72,32.22 M 294.76,69.6 Q 298.45,69.6 301.22,67.75 Q 304,65.9 305.55,62.71 Q 307.1,59.52 307.1,55.57 Q 307.1,51.54 305.55,48.35 Q 304,45.16 301.22,43.31 Q 298.45,41.46 294.76,41.46 Q 291.14,41.46 288.37,43.31 Q 285.6,45.16 284.05,48.35 Q 282.49,51.54 282.49,55.57 Q 282.49,59.52 284.05,62.71 Q 285.6,65.9 288.37,67.75 Q 291.14,69.6 294.76,69.6",
  },
  {
    id: "t1",
    start: 0.7783,
    end: 0.8706,
    length: 205.9,
    d: "M 328.19,33.9 L 348.1,33.9 Q 350.11,33.9 351.46,35.24 Q 352.8,36.59 352.8,38.6 Q 352.8,40.54 351.46,41.84 Q 350.11,43.14 348.1,43.14 L 328.19,43.14 Q 326.17,43.14 324.83,41.8 Q 323.48,40.45 323.48,38.44 Q 323.48,36.5 324.83,35.2 Q 326.17,33.9 328.19,33.9 M 337.18,23.4 Q 339.36,23.4 340.75,24.87 Q 342.13,26.34 342.13,28.52 L 342.13,65.9 Q 342.13,67.08 342.59,67.84 Q 343.06,68.59 343.85,68.93 Q 344.65,69.26 345.58,69.26 Q 346.58,69.26 347.42,68.89 Q 348.26,68.51 349.36,68.51 Q 350.53,68.51 351.5,69.6 Q 352.46,70.69 352.46,72.62 Q 352.46,74.98 349.9,76.49 Q 347.34,78 344.4,78 Q 342.64,78 340.49,77.71 Q 338.35,77.41 336.46,76.28 Q 334.57,75.14 333.31,72.79 Q 332.05,70.44 332.05,66.32 L 332.05,28.52 Q 332.05,26.34 333.52,24.87 Q 334.99,23.4 337.18,23.4",
  },
  {
    id: "e2",
    start: 0.8706,
    end: 1.0,
    length: 288.6,
    d: "M 383.21,78.84 Q 376.07,78.84 370.82,75.86 Q 365.57,72.88 362.75,67.75 Q 359.94,62.63 359.94,56.16 Q 359.94,48.6 363.01,43.27 Q 366.07,37.93 371.03,35.08 Q 375.98,32.22 381.53,32.22 Q 385.81,32.22 389.63,33.98 Q 393.46,35.75 396.4,38.81 Q 399.34,41.88 401.06,45.91 Q 402.78,49.94 402.78,54.48 Q 402.7,56.5 401.18,57.76 Q 399.67,59.02 397.66,59.02 L 365.57,59.02 L 363.05,50.62 L 393.88,50.62 L 392.03,52.3 L 392.03,50.03 Q 391.86,47.59 390.31,45.66 Q 388.75,43.73 386.44,42.59 Q 384.13,41.46 381.53,41.46 Q 379.01,41.46 376.82,42.13 Q 374.64,42.8 373.04,44.4 Q 371.45,46 370.52,48.68 Q 369.6,51.37 369.6,55.49 Q 369.6,60.02 371.49,63.17 Q 373.38,66.32 376.36,67.96 Q 379.34,69.6 382.7,69.6 Q 385.81,69.6 387.66,69.1 Q 389.51,68.59 390.64,67.88 Q 391.78,67.16 392.7,66.66 Q 394.21,65.9 395.56,65.9 Q 397.4,65.9 398.62,67.16 Q 399.84,68.42 399.84,70.1 Q 399.84,72.37 397.49,74.22 Q 395.3,76.07 391.36,77.45 Q 387.41,78.84 383.21,78.84",
  },
];

const AnimatedPathItem = ({ d, length, progress }) => {
  const animatedProps = useAnimatedProps(() => {
    "worklet";
    const strokeDashoffset = length * (1 - progress.value);
    const fillOpacity = Math.min(1, Math.pow(progress.value, 1.2));
    return {
      strokeDashoffset,
      fillOpacity,
    };
  });

  return (
    <>
      <Path
        d={d}
        fill="none"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <AnimatedSvgPath
        d={d}
        fill="url(#indiemateGradient)"
        stroke="url(#indiemateGradient)"
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${length} ${length}`}
        animatedProps={animatedProps}
      />
    </>
  );
};

export const Splash = () => {
  const navigation = useNavigation();
  const isLoggedIn = tokenManager.getToken() !== null;
  const strokeProgress = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  const handleCompleteAndNavigate = useCallback(() => {
    screenOpacity.value = withTiming(
      0,
      { duration: 200, easing: Easing.out(Easing.ease) },
      (done) => {
        if (done) {
          runOnJS(navigation.replace)(
            isLoggedIn ? routesConstants.BottomTabs : routesConstants.intro,
          );
        }
      },
    );
  }, [isLoggedIn, navigation, screenOpacity]);

  useEffect(() => {
    strokeProgress.value = withTiming(
      1,
      {
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
      },
      (finished) => {
        if (finished) {
          runOnJS(handleCompleteAndNavigate)();
        }
      },
    );
  }, [strokeProgress, handleCompleteAndNavigate]);

  const screenStyle = useAnimatedStyle(() => ({
    flex: 1,
    opacity: screenOpacity.value,
  }));

  const svgWidth = Math.min(width * 0.6, 260);
  const svgHeight = svgWidth * (100 / 410);

  return (
    <AppBackground showAuthAnimation={true}>
      <StatusBar hidden />
      <View style={styles.overlay} pointerEvents="none" />
      <Animated.View style={[styles.container, screenStyle]}>
        <View style={styles.svgWrapper}>
          <Svg viewBox="0 0 410 100" width={svgWidth} height={svgHeight}>
            <Defs>
              <LinearGradient
                id="indiemateGradient"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="410"
                y2="0"
              >
                <Stop offset="0%" stopColor={colors.orange} />
                <Stop offset="25%" stopColor={colors.storyRing} />
                <Stop offset="50%" stopColor={colors.lightRed} />
                <Stop offset="75%" stopColor={colors.purple} />
                <Stop offset="100%" stopColor={colors.magenta} />
              </LinearGradient>
            </Defs>
            {PATHS_DATA.map((item) => (
              <AnimatedPathItem
                key={item.id}
                d={item.d}
                length={item.length}
                progress={strokeProgress}
              />
            ))}
          </Svg>
        </View>
      </Animated.View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 20, 36, 0.25)",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  svgWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
});
