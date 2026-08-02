import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors, scales } from "../../utils";
import { fontFamily } from "../../assets";

export const CustomButton = ({
  label,
  onPress,
  buttonWidth,
  disable,
  buttonStyle,
  labelStyle,
  loader,
  gradientColors = [colors.orange, colors.storyRing, colors.lightRed],
}) => {
  const isDisabled = disable || loader;

  const flattenedStyle = StyleSheet.flatten(buttonStyle) || {};
  const { backgroundColor, ...cleanButtonStyle } = flattenedStyle;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[styles.touchable, { width: buttonWidth ? buttonWidth : "100%" }]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, cleanButtonStyle, isDisabled && styles.disabled]}
      >
        {loader ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <View style={styles.textWrapper}>
            <Text style={[styles.label, labelStyle]}>{label}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: scales(20),
    overflow: "hidden",
  },
  button: {
    height: scales(50),
    borderRadius: scales(20),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  textWrapper: {
    paddingTop: Platform.OS === "ios" ? scales(6) : scales(3),
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  label: {
    color: colors.white,
    fontSize: scales(16),
    fontFamily: fontFamily.semiBold,
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
