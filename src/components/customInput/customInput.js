import React, { useState, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { colors, scales } from '../../utils';
import { appImages, fontFamily } from '../../assets';

export const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder = '',
  isPassword = false,
  height = 60,
  isEditable = true,
  multiline = false,
  icon,
  containerStyle,
  inputStyle,
  labelStyle,
  ...rest
}) => {
  const [secureText, setSecureText] = useState(isPassword);
  const [isFocused, setIsFocused] = useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;

  const animate = useCallback((toValue) => {
    Animated.timing(glowAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [glowAnim]);

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
    outputRange: ['rgba(255,255,255,0.18)', colors.blue + 'CC'],
  });

  const bgColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.13)'],
  });

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.8],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, isFocused && styles.labelFocused, labelStyle]}>
          {label}
        </Text>
      ) : null}

      <Animated.View style={[styles.glowRing, { shadowOpacity }]}>
        <Animated.View
          style={[
            styles.inputContainer,
            {
              borderColor,
              backgroundColor: bgColor,
            },
          ]}
        >
          {icon && <Image source={icon} style={styles.leftIcon} />}

          <TextInput
            {...rest}
            style={[
              styles.input,
              {
                height,
                textAlignVertical: multiline ? 'top' : 'center',
              },
              inputStyle,
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.35)"
            secureTextEntry={secureText}
            autoCapitalize="none"
            multiline={multiline}
            editable={isEditable}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          {isPassword && (
            <TouchableOpacity
              onPress={() => setSecureText(prev => !prev)}
              style={styles.eyeBtn}
              activeOpacity={0.7}
            >
              <Image
                source={secureText ? appImages.eyeclose : appImages.eyeopen}
                style={styles.eyeImage}
              />
            </TouchableOpacity>
          )}
        </Animated.View>

        <View style={styles.bottomShadow} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  label: {
    fontSize: scales(14),
    color: 'rgba(255,255,255,0.5)',
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
  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    resizeMode: 'contain',
    tintColor: 'rgba(255,255,255,0.65)',
  },
  leftIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: 'rgba(255,255,255,0.6)',
    marginRight: 10,
  },
});