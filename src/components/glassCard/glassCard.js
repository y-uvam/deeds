import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { scales } from '../../utils';

export const GlassCard = memo(
  ({
    children,
    style,
    contentStyle,
    borderRadius = 30,
    padding = 22,
  }) => {
    return (
      <View
        style={[
          styles.container,
          { borderRadius },
          style,
        ]}
      >
        <BlurView
          style={[StyleSheet.absoluteFillObject, { borderRadius }]}
          blurType="light"
          blurAmount={20}
          reducedTransparencyFallbackColor="transparent"
        />

        <View
          pointerEvents="none"
          style={[styles.tint, { borderRadius }]}
        />

        <View
          pointerEvents="none"
          style={[styles.stroke, { borderRadius }]}
        />

        <View
          style={[
            styles.content,
            {
              padding: scales(padding),
              borderRadius,
            },
            contentStyle,
          ]}
        >
          {children}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 20,
  },

  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  stroke: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    opacity: 0.4,
  },

  content: {
    zIndex: 5,
  },
});