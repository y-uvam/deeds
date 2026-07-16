import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
} from "react-native";
import { AppBackground, Spacer } from "../../components";
import { colors, scales } from "../../utils";
import { fontFamily, appImages } from "../../assets";
import { navigate, goBack } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";

const STEPS = ["Preparing", "Uploading", "Processing", "Publishing"];

const ProgressBar = ({ progress }) => {
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: progress,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const barWidth = width.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.trackOuter}>
      <Animated.View style={[styles.trackFill, { width: barWidth }]} />
    </View>
  );
};

export const Upload = ({ route }) => {
  const { contentType, media = [], metadata = {} } = route.params ?? {};
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

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <AppBackground>
      <Spacer height={scales(60)} />

      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          {done ? (
            <Image source={appImages.like} style={styles.doneIcon} tintColor={colors.lightGreen} />
          ) : (
            <Image source={appImages.send} style={styles.uploadIcon} tintColor={colors.blue} />
          )}
        </View>

        <Spacer height={scales(28)} />

        <Text style={styles.title}>
          {done ? "Published!" : "Uploading your " + (contentType?.label ?? "post")}
        </Text>
        <Text style={styles.subtitle}>
          {done
            ? "Your post is live. Go share it with the world 🌍"
            : STEPS[stepIndex] + "..."}
        </Text>

        <Spacer height={scales(32)} />

        <ProgressBar progress={progress} />

        <Text style={styles.percent}>{Math.round(progress)}%</Text>

        <Spacer height={scales(12)} />

        <View style={styles.stepsRow}>
          {STEPS.map((step, i) => (
            <View key={step} style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  i <= stepIndex && styles.stepDotActive,
                  done && styles.stepDotDone,
                ]}
              />
              <Text
                style={[
                  styles.stepText,
                  i <= stepIndex && styles.stepTextActive,
                ]}
              >
                {step}
              </Text>
            </View>
          ))}
        </View>

        {done && (
          <>
            <Spacer height={scales(40)} />
            <View style={styles.doneActions}>
              <TouchableOpacity
                style={styles.doneBtn}
                onPress={() => navigate(routesConstants.Home)}
                activeOpacity={0.8}
              >
                <Text style={styles.doneBtnText}>Go to Feed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.doneBtn, styles.doneBtnSecondary]}
                onPress={() => navigate(routesConstants.Profile)}
                activeOpacity={0.8}
              >
                <Text style={[styles.doneBtnText, styles.doneBtnSecondaryText]}>
                  View Post
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: scales(32),
  },
  iconWrapper: {
    width: scales(80),
    height: scales(80),
    borderRadius: scales(40),
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite12,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadIcon: {
    width: scales(32),
    height: scales(32),
    resizeMode: "contain",
  },
  doneIcon: {
    width: scales(36),
    height: scales(36),
    resizeMode: "contain",
  },
  title: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(20),
    textAlign: "center",
  },
  subtitle: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(14),
    textAlign: "center",
    marginTop: scales(6),
  },
  trackOuter: {
    width: "100%",
    height: scales(6),
    borderRadius: scales(3),
    backgroundColor: colors.transparentWhite10,
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    borderRadius: scales(3),
    backgroundColor: colors.blue,
  },
  percent: {
    color: colors.blue,
    fontFamily: fontFamily.bold,
    fontSize: scales(13),
    marginTop: scales(8),
    alignSelf: "flex-end",
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: scales(20),
  },
  stepItem: {
    alignItems: "center",
    gap: scales(4),
  },
  stepDot: {
    width: scales(8),
    height: scales(8),
    borderRadius: scales(4),
    backgroundColor: colors.transparentWhite15,
  },
  stepDotActive: {
    backgroundColor: colors.blue,
  },
  stepDotDone: {
    backgroundColor: colors.lightGreen,
  },
  stepText: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(10),
  },
  stepTextActive: {
    color: colors.white,
    fontFamily: fontFamily.medium,
  },
  doneActions: {
    width: "100%",
    gap: scales(12),
  },
  doneBtn: {
    backgroundColor: colors.blue,
    paddingVertical: scales(14),
    borderRadius: scales(12),
    alignItems: "center",
  },
  doneBtnText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(15),
  },
  doneBtnSecondary: {
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite15,
  },
  doneBtnSecondaryText: {
    color: colors.transparentWhite85,
  },
});
