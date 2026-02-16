import React from "react";
import { Animated, Platform, StyleSheet } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { colors, topInset } from "../utils";

// Custom FlashMessage Component with Animation
const FlashMessageComponent = () => {
  // Animation value for smooth slide-in/slide-out
  const slideAnim = new Animated.Value(-100); // Start off-screen (top)

  // Function to trigger animation
  const animateMessage = (show) => {
    Animated.spring(slideAnim, {
      toValue: show ? 0 : -100, // Slide in (0) or out (-100)
      useNativeDriver: true,
      friction: 8, // Controls "bounciness"
      tension: 40, // Controls speed
    }).start();
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <FlashMessage
        position="top"
        floating // Gives it a card-like effect
        hideOnPress // Dismiss on tap
        duration={3000} // Auto-dismiss after 3 seconds
        animationDuration={300} // Smooth animation timing
        onShow={() => animateMessage(true)} // Slide in when shown
        onHide={() => animateMessage(false)} // Slide out when hidden
        style={styles.flashStyle} // Custom styling
      />
    </Animated.View>
  );
};

// Function to show custom messages with enhanced UI
export const showCustomMessage = (message, type) => {
  const typeStyles = {
    success: { backgroundColor: colors.green, icon: "success" },
    danger: { backgroundColor: colors.red, icon: "danger" },
    info: { backgroundColor: colors.blue, icon: "info" },
    warning: { backgroundColor: colors.yellow, icon: "warning" },
  };

  const style = typeStyles[type] || typeStyles.info; // Default to 'info' if type is invalid

  showMessage({
    message, // The message text
    type: style.icon, // Icon based on type
    backgroundColor: style.backgroundColor, // Dynamic background color
    color: colors.white, // Text/icon color
    style: styles.messageStyle, // Additional styling
    titleStyle: styles.titleStyle, // Message text styling
  });
};

// Styles for the FlashMessage
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Platform.OS === "ios" ? 0 : topInset,
    left: 0,
    right: 0,
    zIndex: 999, // Ensure it stays on top
  },
  flashStyle: {
    borderRadius: 12, // Rounded corners for modern UI
    marginTop: 40, // Space from the top (status bar)
    marginHorizontal: 10, // Side margins
    shadowColor: "#000", // Subtle shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // Shadow for Android
  },
  messageStyle: {
    paddingVertical: 12, // Vertical padding for better spacing
    paddingHorizontal: 16, // Horizontal padding
    alignItems: "center", // Center content
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: "600", // Slightly bold text
    textAlign: "center",
  },
});

export default FlashMessageComponent;
