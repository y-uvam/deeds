import React from "react";
import {
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
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
    <TouchableWithoutFeedback onPress={onPress} disabled={isDisabled}>
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
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Text style={[styles.label, { ...labelStyle }]}>{label}</Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.blue,
    paddingVertical: 18,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: colors.white,
    fontSize: scales(15),
    fontWeight: "700",
    fontFamily: fontFamily.regular,
  },
});
