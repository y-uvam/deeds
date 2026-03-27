import React, { useState, useRef, useCallback, memo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { colors, scales } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { BlurView } from "@react-native-community/blur";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

export const CustomInput = memo(
  ({
    label,
    value,
    onChangeText,
    placeholder = "",
    isPassword = false,
    height = 60,
    isEditable = true,
    multiline = false,
    icon,
    containerStyle,
    inputStyle,
    labelStyle,
    errors,
    isBottomSheet,
    ...rest
  }) => {
    const InputComponent = isBottomSheet ? BottomSheetTextInput : TextInput;
    const [secureText, setSecureText] = useState(isPassword);
    const [isFocused, setIsFocused] = useState(false);
    const glowAnim = useRef(new Animated.Value(0)).current;

    const animate = useCallback(
      (toValue) => {
        Animated.timing(glowAnim, {
          toValue,
          duration: 200,
          useNativeDriver: false,
        }).start();
      },
      [glowAnim],
    );

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      animate(1);
    }, [animate]);
    const handleBlur = useCallback(() => {
      setIsFocused(false);
      animate(0);
    }, [animate]);

    const borderColor = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [errors ? colors.red : colors.white, colors.blue],
    });
    const overlayColor = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(0,0,0,0)", "rgba(255,255,255,0.13)"],
    });
    const shadowOpacity = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.8],
    });

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text
            style={[styles.label, isFocused && styles.labelFocused, labelStyle]}
          >
            {label}
          </Text>
        )}

        <Animated.View style={[styles.glowRing, { shadowOpacity }]}>
          <Animated.View
            style={[styles.inputContainer, { borderColor, overflow: "hidden" }]}
          >
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="light"
              blurAmount={4}
              reducedTransparencyFallbackColor="white"
            />
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: overlayColor },
              ]}
            />

            {icon && (
              <Image
                source={icon}
                style={[
                  styles.leftIcon,
                  { tintColor: isFocused ? colors.blue : colors.white },
                ]}
              />
            )}

            <InputComponent
              {...rest}
              style={[
                styles.input,
                { height, textAlignVertical: multiline ? "top" : "center" },
                inputStyle,
              ]}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="rgba(255,255,255,0.4)"
              secureTextEntry={secureText}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              multiline={multiline}
              editable={isEditable}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />

            {isPassword && (
              <TouchableOpacity
                onPress={() => setSecureText((p) => !p)}
                style={styles.eyeBtn}
                activeOpacity={0.7}
              >
                <Image
                  source={secureText ? appImages.eyeclose : appImages.eyeopen}
                  style={[
                    styles.eyeImage,
                    { tintColor: isFocused ? colors.blue : colors.white },
                  ]}
                />
              </TouchableOpacity>
            )}
          </Animated.View>
        </Animated.View>
        {errors && (
          <Text style={styles.errorText}>
            {errors.message || "This field is required"}
          </Text>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
  label: {
    fontSize: scales(14),
    color: colors.white,
    fontFamily: fontFamily.medium,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.4,
  },
  labelFocused: {
    color: colors.blue,
  },
  glowRing: {
    borderRadius: scales(15),
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 0 },
  },
  errorText: {
    color: colors.red,
    fontSize: scales(12),
    fontFamily: fontFamily.regular,
    marginTop: 4,
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: scales(15),
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: scales(15),
    color: colors.white,
    fontFamily: fontFamily.regular,
    paddingVertical: 18,
    letterSpacing: 0.3,
  },
  eyeBtn: {
    marginLeft: 10,
    padding: 4,
  },
  eyeImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    tintColor: colors.white,
  },
  leftIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    tintColor: colors.white,
    marginRight: 10,
  },
});
