import React, { useEffect, useRef, useState, memo } from "react";
import { View, Text, Animated, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { AppBackground, Spacer } from "../../components";
import { colors, scales, commonText } from "../../utils";
import { animations } from "../../animations/animations";
import { navigate, reset } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";
import { styles } from "./uploadStyles";

const STEPS = ["Preparing", "Uploading", "Processing", "Publishing"];

const ProgressBar = memo(({ progress }) => {
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: progress,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [progress, width]);

  const barWidth = width.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.trackOuter}>
      <Animated.View style={[styles.trackFill, { width: barWidth }]} />
    </View>
  );
});

export const Upload = ({ route }) => {
  const { contentType } = route.params ?? {};
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * 8 + 2, 100);
        const step = Math.floor((next / 100) * STEPS.length);
        setStepIndex(Math.min(step, STEPS.length - 1));
        if (next >= 100) {
          clearInterval(intervalRef.current);
          setDone(true);
        }
        return next;
      });
    }, 300);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <AppBackground showAuthAnimation={true}>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          {done ? (
            <LottieView
              source={animations.success}
              autoPlay
              loop={false}
              style={styles.lottieIcon}
            />
          ) : (
            <LottieView
              source={animations.loader}
              autoPlay
              loop
              style={styles.lottieIcon}
            />
          )}
        </View>

        <Spacer height={scales(28)} />

        <Text style={styles.title}>
          {done
            ? commonText.published
            : "Uploading your " + (contentType?.label ?? commonText.post)}
        </Text>
        <Text style={styles.subtitle}>
          {done ? commonText.yourPostIsLive : STEPS[stepIndex] + "..."}
        </Text>

        <Spacer height={scales(32)} />

        <ProgressBar progress={progress} />

        <Text style={styles.percent}>{Math.round(progress)}%</Text>

        <Spacer height={scales(12)} />

        {done && (
          <>
            <Spacer height={scales(40)} />
            <View style={styles.doneActions}>
              <TouchableOpacity
                style={styles.doneBtn}
                onPress={() => reset(routesConstants.BottomTabs)}
                activeOpacity={0.8}
              >
                <Text style={styles.doneBtnText}>{commonText.goToFeed}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.doneBtn, styles.doneBtnSecondary]}
                onPress={() => navigate(routesConstants.Profile)}
                activeOpacity={0.8}
              >
                <Text style={[styles.doneBtnText, styles.doneBtnSecondaryText]}>
                  {commonText.viewPost}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </AppBackground>
  );
};
