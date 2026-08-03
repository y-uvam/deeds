import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import Toast from "react-native-toast-message";
import { BlurView } from "@react-native-community/blur";
import { colors, scales } from "../utils";
import { fontFamily } from "../assets";

const CustomToastCard = ({ text1, text2, type }) => {
  let textColor = colors.green;

  if (type === "error" || type === "danger") {
    textColor = colors.red;
  } else if (type === "warning") {
    textColor = colors.yellow;
  } else if (type === "info") {
    textColor = colors.blue;
  }

  return (
    <View style={styles.toastCardWrapper}>
      <View style={styles.toastCardContainer}>
        <BlurView
          style={[StyleSheet.absoluteFill, { overflow: "hidden" }]}
          blurType="dark"
          blurAmount={20}
          reducedTransparencyFallbackColor={colors.blurFallback}
        />

        <View style={styles.toastTextContainer}>
          {!!text1 && (
            <Text style={[styles.toastText1, { color: textColor }]}>
              {text1}
            </Text>
          )}
          {!!text2 && <Text style={styles.toastText2}>{text2}</Text>}
        </View>
      </View>
    </View>
  );
};

export const toastConfig = {
  success: (props) => (
    <CustomToastCard {...props} type="success" text1={props.text1} text2={props.text2} />
  ),
  error: (props) => (
    <CustomToastCard {...props} type="error" text1={props.text1} text2={props.text2} />
  ),
  danger: (props) => (
    <CustomToastCard {...props} type="danger" text1={props.text1} text2={props.text2} />
  ),
  info: (props) => (
    <CustomToastCard {...props} type="info" text1={props.text1} text2={props.text2} />
  ),
  warning: (props) => (
    <CustomToastCard {...props} type="warning" text1={props.text1} text2={props.text2} />
  ),
};

const FlashMessageComponent = () => {
  return (
    <Toast
      config={toastConfig}
      topOffset={Platform.OS === "ios" ? scales(54) : scales(30)}
    />
  );
};

export const showCustomMessage = (message, type = "info", description = "") => {
  const toastType = type === "danger" ? "error" : type;

  Toast.show({
    type: toastType,
    text1: message,
    text2: description,
    visibilityTime: 3500,
    autoHide: true,
    topOffset: Platform.OS === "ios" ? scales(54) : scales(30),
  });
};

const styles = StyleSheet.create({
  toastCardWrapper: {
    width: "88%",
    alignSelf: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 16,
  },
  toastCardContainer: {
    borderRadius: scales(18),
    overflow: "hidden",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.transparentWhite12,
  },
  toastTextContainer: {
    paddingVertical: scales(14),
    paddingHorizontal: scales(20),
    alignItems: "center",
    justifyContent: "center",
  },
  toastText1: {
    fontSize: scales(14),
    fontFamily: fontFamily.bold,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  toastText2: {
    fontSize: scales(12),
    fontFamily: fontFamily.regular,
    color: colors.transparentWhite40,
    textAlign: "center",
    marginTop: scales(4),
  },
});

export default FlashMessageComponent;
