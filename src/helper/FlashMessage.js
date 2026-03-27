import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { BlurView } from "@react-native-community/blur";
import LinearGradient from "react-native-linear-gradient";
import { colors, scales } from "../utils";
import { fontFamily } from "../assets";

// Custom FlashMessage Component
const FlashMessageComponent = () => {
  return (
    <FlashMessage
      position="top"
      duration={3500}
      animationDuration={450}
      renderFlashMessage={(message) => {
        const type = message.message?.type || "info";
        const bgColor = message.message?.backgroundColor;

        // Custom Gradient Colors based on type
        let gradientColors = ["#00B4DB", "#0083B0"]; // Default info
        if (bgColor === colors.red || type === "danger") {
          gradientColors = ["#FF4B2B", "#FF416C"];
        } else if (bgColor === colors.green || type === "success") {
          gradientColors = ["#56AB2F", "#A8E063"];
        } else if (bgColor === colors.yellow || type === "warning") {
          gradientColors = ["#F1C40F", "#F39C12"];
        }

        return (
          <View style={styles.outerContainer}>
            <View style={styles.cardContainer}>
              {/* Premium Glass Effect Background */}
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={12}
                reducedTransparencyFallbackColor="black"
              />
              
              <View style={styles.contentWrapper}>
                {/* Status Indicator Bar */}
                <LinearGradient
                  colors={gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.indicatorBar}
                />
                
                <View style={styles.textContainer}>
                   <Text style={[styles.titleText, { color: gradientColors[0] }]}>
                     {type.charAt(0).toUpperCase() + type.slice(1)}
                   </Text>
                   <Text style={styles.messageText}>{message.message?.message}</Text>
                   {!!message.message?.description && (
                     <Text style={styles.descText}>{message.message.description}</Text>
                   )}
                </View>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
};

// Function to show custom messages with enhanced UI
export const showCustomMessage = (message, type = "info", description = "") => {
  const typeConfigs = {
    success: { backgroundColor: colors.green },
    danger: { backgroundColor: colors.red },
    info: { backgroundColor: colors.blue },
    warning: { backgroundColor: colors.yellow },
  };

  const config = typeConfigs[type] || typeConfigs.info;

  showMessage({
    message,
    description,
    type,
    backgroundColor: config.backgroundColor,
    color: colors.white,
    hideOnPress: true,
    animated: true,
  });
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingTop: Platform.OS === "ios" ? scales(50) : scales(20),
    paddingHorizontal: scales(16),
    zIndex: 9999999,
  },
  cardContainer: {
    borderRadius: scales(20),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
    backgroundColor: "rgba(25, 25, 25, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "stretch", // Ensures children stretch to match container height
  },
  indicatorBar: {
    width: scales(6),
    borderTopLeftRadius: scales(20),
    borderBottomLeftRadius: scales(20),
  },
  textContainer: {
    flex: 1,
    paddingVertical: scales(14),
    paddingHorizontal: scales(18),
  },
  titleText: {
    fontSize: scales(11),
    fontFamily: fontFamily.bold,
    letterSpacing: 1.5,
    marginBottom: scales(4),
  },
  messageText: {
    fontSize: scales(14),
    fontFamily: fontFamily.bold,
    color: colors.white,
    letterSpacing: 0.3,
  },
  descText: {
    fontSize: scales(12),
    fontFamily: fontFamily.medium,
    color: "rgba(255,255,255,0.6)",
    marginTop: scales(2),
  },
});

export default FlashMessageComponent;
