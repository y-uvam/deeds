import React, { useEffect, memo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { appImages, fontFamily } from "../../assets";
import { colors, scales } from "../../utils";
import { goBack } from "../../navigation";
import { BlurView } from "@react-native-community/blur";

const { width } = Dimensions.get("window");
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const PulseRing = memo(({ delay, size }) => {
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.15, { duration: 400 }),
          withTiming(0, { duration: 1800 }),
        ),
        -1,
        false,
      ),
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 2200, easing: Easing.out(Easing.ease) }),
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
    borderColor: "rgba(255,255,255,0.5)",
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={style} />;
});

export const RoundIconButton = ({ icon, onPress }) => {
  if (!icon) return null;
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.roundButtonWrapper, animatedStyle]}
    >
      <PulseRing delay={600} size={scales(56)} />
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={20}
        reducedTransparencyFallbackColor="transparent"
      />
      <View style={[StyleSheet.absoluteFill, styles.buttonOverlay]} />
      <Image source={icon} style={styles.iconImage} tintColor={colors.white} />
    </AnimatedTouchableOpacity>
  );
};

export const HeaderLogo = () => {
  const letters = [
    appImages.v,
    appImages.i,
    appImages.r,
    appImages.t,
    appImages.u,
    appImages.e,
  ];
  return (
    <View style={styles.logoRow}>
      {letters.map((img, i) => (
        <View key={i} style={styles.miniLetterWrapper}>
          <Image source={img} style={styles.miniLetter} resizeMode="contain" />
        </View>
      ))}
    </View>
  );
};

export const HeaderPill = ({ label, isLogo }) => {
  if (!label && !isLogo) return null;

  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-12);

  useEffect(() => {
    scale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 90 }));
    opacity.value = withDelay(200, withTiming(1, { duration: 700 }));
    translateY.value = withDelay(
      200,
      withSpring(0, { damping: 12, stiffness: 90 }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.headerPillWrapper, animatedStyle]}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={30}
        reducedTransparencyFallbackColor="transparent"
      />
      <View style={[StyleSheet.absoluteFill, styles.pillOverlay]} />
      {isLogo ? (
        <HeaderLogo />
      ) : (
        <Text style={styles.headerLabel}>{label}</Text>
      )}
    </Animated.View>
  );
};

export const Header = ({
  label,
  showBackButton,
  rightIcon,
  onRightPress,
  isHome,
}) => {
  const containerTranslateY = useSharedValue(-50);
  const containerOpacity = useSharedValue(0);
  const lineWidth = useSharedValue(0);
  const lineOpacity = useSharedValue(0);

  useEffect(() => {
    containerTranslateY.value = withTiming(0, {
      duration: 700,
      easing: Easing.out(Easing.ease),
    });
    containerOpacity.value = withTiming(1, { duration: 700 });
    lineWidth.value = withDelay(
      500,
      withSpring(width * 0.72, { damping: 20, stiffness: 45 }),
    );
    lineOpacity.value = withDelay(500, withTiming(0.5, { duration: 600 }));
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: containerTranslateY.value }],
    opacity: containerOpacity.value,
  }));

  const lineStyle = useAnimatedStyle(() => ({
    width: lineWidth.value,
    opacity: lineOpacity.value,
  }));

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.container, containerStyle]}>
        <View style={styles.sideContainer}>
          {showBackButton && (
            <RoundIconButton
              icon={appImages.backarrow}
              onPress={() => goBack()}
            />
          )}
        </View>

        <View style={styles.centerContainer}>
          <HeaderPill label={label} isLogo={isHome} />
        </View>

        <View style={styles.sideContainerRight}>
          {rightIcon ? (
            <RoundIconButton icon={rightIcon} onPress={onRightPress} />
          ) : (
            isHome && (
              <RoundIconButton icon={appImages.bell} onPress={() => {}} />
            )
          )}
        </View>
      </Animated.View>

      <Animated.View style={[styles.bottomLine, lineStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingTop: Platform.OS === "ios" ? scales(10) : scales(20),
    alignItems: "center",
    marginBottom: scales(15),
  },
  container: {
    paddingHorizontal: scales(15),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: scales(50),
    width: "100%",
  },
  sideContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  sideContainerRight: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  centerContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  roundButtonWrapper: {
    height: scales(40),
    width: scales(40),
    borderRadius: scales(20),
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: StyleSheet.hairlineWidth,
  },
  buttonOverlay: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: scales(20),
  },
  iconImage: {
    height: scales(18),
    width: scales(18),
    resizeMode: "contain",
  },
  headerPillWrapper: {
    height: scales(40),
    paddingHorizontal: scales(22),
    borderRadius: scales(20),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  pillOverlay: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: scales(20),
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  miniLetterWrapper: {
    marginHorizontal: scales(1),
  },
  miniLetter: {
    width: scales(14),
    height: scales(20),
    tintColor: colors.white,
  },
  headerLabel: {
    fontFamily: fontFamily.bold,
    color: colors.white,
    fontSize: scales(13),
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },
  bottomLine: {
    height: 1,
    backgroundColor: colors.white,
    borderRadius: 1,
    shadowColor: colors.white,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
    marginTop: scales(10),
  },
});
