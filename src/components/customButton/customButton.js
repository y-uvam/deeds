import React from "react";
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
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
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: scales(20),
  },
  button: {
    // paddingVertical: scales(15),
    minHeight: scales(50),
    borderRadius: scales(20),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: scales(16),
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: colors.white,
    fontSize: scales(16),
    fontFamily: fontFamily.semiBold,
    letterSpacing: 0.5,
    textAlign: "center",
    alignSelf: "center",
    includeFontPadding: false,
    lineHeight: scales(20),
  },
});
