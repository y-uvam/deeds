import React from "react";
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { colors, scales } from "../../utils";
import { fontFamily } from "../../assets";

export const CustomButton = ({
  label,
  onPress,
  buttonWidth,
  disable,
  buttonStyle,
  labelStyle,
  loader, // new prop
}) => {
  const isDisabled = disable || loader;

  return (
    <TouchableOpacity onPress={onPress} disabled={isDisabled}>
      <View
        style={[
          styles.button,
          {
            width: buttonWidth ? buttonWidth : "100%",
            ...buttonStyle,
            opacity: isDisabled ? 0.7 : 1,
          },
        ]}
      >
        {loader ? (
          <ActivityIndicator size="small" color={colors.darkblack || "#000"} />
        ) : (
          <Text style={[styles.label, { ...labelStyle }]}>{label}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.button,
    paddingVertical: scales(16),
    borderRadius: scales(20),
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: colors.white,
    fontSize: scales(16),
    fontFamily: fontFamily.semiBold,
    letterSpacing: 0.5,
  },
});
