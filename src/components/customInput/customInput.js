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
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

export const CustomInput = memo(
  ({
    label,
    value,
    onChangeText,
    placeholder = "",
    isPassword = false,
    height = scales(54),
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
      outputRange: [errors ? colors.red : colors.transparentWhite15, colors.blue],
    });
    const backgroundColor = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.transparentWhite5, colors.transparentWhite8],
    });
    const shadowOpacity = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.35],
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
            style={[
              styles.inputContainer,
              { borderColor, backgroundColor, overflow: "hidden" },
            ]}
          >
            {icon && (
              <Image
                source={icon}
                style={[
                  styles.leftIcon,
                  { tintColor: isFocused ? colors.blue : colors.profileHandleText },
                ]}
              />
            )}

            <InputComponent
              {...rest}
              style={[
                styles.input,
                {
                  height,
                  textAlignVertical: multiline ? "top" : "center",
                  paddingVertical: multiline ? scales(14) : 0,
                },
                inputStyle,
              ]}
              selectionColor={colors.blue}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={colors.transparentWhite40}
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
                    { tintColor: isFocused ? colors.blue : colors.profileHandleText },
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
    marginVertical: scales(8),
  },
  label: {
    fontSize: scales(14),
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: fontFamily.medium,
    marginBottom: scales(8),
    marginLeft: scales(4),
    letterSpacing: 0.3,
  },
  labelFocused: {
    color: colors.blue,
  },
  glowRing: {
    borderRadius: scales(14),
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  errorText: {
    color: colors.red,
    fontSize: scales(12),
    fontFamily: fontFamily.regular,
    marginTop: scales(4),
    marginLeft: scales(4),
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: scales(14),
    paddingHorizontal: scales(16),
  },
  input: {
    flex: 1,
    fontSize: scales(15),
    color: colors.white,
    fontFamily: fontFamily.medium,
    paddingVertical: 0,
    letterSpacing: 0.3,
  },
  eyeBtn: {
    marginLeft: scales(10),
    padding: scales(4),
  },
  eyeImage: {
    width: scales(20),
    height: scales(20),
    resizeMode: "contain",
  },
  leftIcon: {
    width: scales(18),
    height: scales(18),
    resizeMode: "contain",
    marginRight: scales(10),
  },
});
