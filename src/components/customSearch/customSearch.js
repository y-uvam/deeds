import React, { useState, useRef, useCallback } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { BlurView } from "@react-native-community/blur";
import { colors, scales } from "../../utils";
import { appImages, fontFamily } from "../../assets";

const { width } = Dimensions.get("window");

export const CustomSearch = ({
  value,
  onChangeText,
  placeholder = "Search",
  containerStyle,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  onCancel: onCancelProp,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const cancelAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  const animate = useCallback(
    (focused) => {
      Animated.parallel([
        Animated.timing(cancelAnim, {
          toValue: focused ? 1 : 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: focused ? 1 : 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    },
    [cancelAnim, glowAnim],
  );

  const handleFocus = () => {
    setIsFocused(true);
    animate(true);
    onFocusProp?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    animate(false);
    onBlurProp?.();
  };

  const handleCancel = () => {
    inputRef.current?.blur();
    onChangeText?.("");
    onCancelProp?.();
  };

  const inputWidth = cancelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [width - scales(32), width - scales(100)],
  });

  const cancelOpacity = cancelAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.profileDivider, colors.blue],
  });

  return (
    <View style={[styles.mainContainer, containerStyle]}>
      <Animated.View
        style={[styles.searchWrapper, { width: inputWidth, borderColor }]}
      >
        {/* <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="black"
        /> */}
        <View style={styles.contentRow}>
          <Image
            source={appImages.browse}
            style={[
              styles.searchIcon,
              { tintColor: isFocused ? colors.blue : colors.profileHandleText },
            ]}
          />
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            onFocus={handleFocus}
            onBlur={handleBlur}
            selectionColor={colors.blue}
            autoCapitalize="none"
          />
          {value?.length > 0 && (
            <TouchableOpacity
              onPress={() => onChangeText?.("")}
              activeOpacity={0.7}
            >
              <View style={styles.clearCircle}>
                <Image source={appImages.close} style={styles.clearIcon} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <Animated.View
        style={[styles.cancelBtnContainer, { opacity: cancelOpacity }]}
      >
        <TouchableOpacity onPress={handleCancel} activeOpacity={0.7}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scales(16),
    marginVertical: scales(10),
    height: scales(46),
  },
  searchWrapper: {
    height: "100%",
    borderRadius: scales(14),
    borderWidth: 1,
    overflow: "hidden",
    backgroundColor: colors.background,
  },
  contentRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scales(12),
  },
  searchIcon: {
    width: scales(18),
    height: scales(18),
    marginRight: scales(10),
  },
  input: {
    flex: 1,
    height: "100%",
    color: colors.white,
    fontSize: scales(15),
    fontFamily: fontFamily.medium,
    paddingVertical: 0, // Critical for iOS centering
  },
  clearCircle: {
    width: scales(18),
    height: scales(18),
    borderRadius: scales(9),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  clearIcon: {
    width: scales(10),
    height: scales(10),
    tintColor: colors.white,
  },
  cancelBtnContainer: {
    position: "absolute",
    right: scales(16),
    justifyContent: "center",
  },
  cancelText: {
    color: colors.white,
    fontSize: scales(15),
    fontFamily: fontFamily.semiBold,
  },
});
