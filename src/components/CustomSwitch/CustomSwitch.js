import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';
import { colors, scales } from '../../utils';

export const CustomSwitch = ({
  value = false,
  onValueChange,
  activeColor = colors.green,
  inactiveColor = colors.gray,
}) => {
  const switchTranslate = useSharedValue(value ? scales(20) : 0);
  const progress = useDerivedValue(() => {
    return withSpring(value ? 1 : 0);
  });

  useEffect(() => {
    switchTranslate.value = withSpring(value ? scales(20) : 0, {
      damping: 15,
      stiffness: 150,
      mass: 0.1,
    });
  }, [value, switchTranslate]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [inactiveColor || '#D1D1D6', activeColor || '#34C759']
      ),
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: switchTranslate.value }],
    };
  });

  return (
    <Pressable onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.container, containerAnimatedStyle]}>
        <Animated.View style={[styles.thumb, thumbAnimatedStyle]} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scales(50),
    height: scales(30),
    borderRadius: scales(20),
    padding: scales(5),
    justifyContent: 'center',
  },
  thumb: {
    width: scales(20),
    height: scales(20),
    borderRadius: scales(10),
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
