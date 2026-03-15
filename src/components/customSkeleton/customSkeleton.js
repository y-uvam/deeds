import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import { colors, scales } from '../../utils';

const { width } = Dimensions.get('window');

const LAYOUTS = {
  listItem: [
    { key: 'avatar',    width: scales(44), height: scales(44), borderRadius: scales(22) },
    {
      key: 'lines',
      flexDirection: 'column',
      children: [
        { key: 'line1', width: width * 0.5,  height: scales(13), marginBottom: scales(6),  borderRadius: scales(6) },
        { key: 'line2', width: width * 0.35, height: scales(11), borderRadius: scales(6) },
      ],
      marginLeft: scales(12),
      justifyContent: 'center',
    },
  ],
  card: [
    { key: 'banner',   width: '100%', height: scales(130), borderRadius: scales(16), marginBottom: scales(12) },
    { key: 'title',    width: width * 0.55, height: scales(14), borderRadius: scales(6), marginBottom: scales(8) },
    { key: 'subtitle', width: width * 0.38, height: scales(11), borderRadius: scales(6), marginBottom: scales(16) },
    {
      key: 'tags',
      flexDirection: 'row',
      children: [
        { key: 't1', width: scales(60), height: scales(22), borderRadius: scales(11), marginRight: scales(8) },
        { key: 't2', width: scales(70), height: scales(22), borderRadius: scales(11), marginRight: scales(8) },
        { key: 't3', width: scales(50), height: scales(22), borderRadius: scales(11) },
      ],
    },
  ],
  profile: [
    { key: 'profilePic', width: scales(72), height: scales(72), borderRadius: scales(36), alignSelf: 'center', marginBottom: scales(14) },
    { key: 'name',       width: width * 0.42, height: scales(16), borderRadius: scales(8),  alignSelf: 'center', marginBottom: scales(8) },
    { key: 'bio1',       width: width * 0.65, height: scales(12), borderRadius: scales(6),  alignSelf: 'center', marginBottom: scales(6) },
    { key: 'bio2',       width: width * 0.5,  height: scales(12), borderRadius: scales(6),  alignSelf: 'center', marginBottom: scales(20) },
    {
      key: 'stats',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      children: [
        { key: 's1', width: scales(55), height: scales(40), borderRadius: scales(12) },
        { key: 's2', width: scales(55), height: scales(40), borderRadius: scales(12) },
        { key: 's3', width: scales(55), height: scales(40), borderRadius: scales(12) },
      ],
    },
  ],
  text: [
    { key: 'tx1', width: '100%',       height: scales(12), borderRadius: scales(6), marginBottom: scales(8) },
    { key: 'tx2', width: '100%',       height: scales(12), borderRadius: scales(6), marginBottom: scales(8) },
    { key: 'tx3', width: width * 0.80, height: scales(12), borderRadius: scales(6), marginBottom: scales(8) },
    { key: 'tx4', width: '100%',       height: scales(12), borderRadius: scales(6), marginBottom: scales(8) },
    { key: 'tx5', width: width * 0.60, height: scales(12), borderRadius: scales(6) },
  ],
};
export const CustomSkeleton = ({
  variant = 'card',
  count = 1,
  loading = true,
  children,     
  layout,
  style,
}) => {
  const resolvedLayout = layout || LAYOUTS[variant] || LAYOUTS.card;

  return (
    <View style={[styles.wrapper, style]}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          isLoading={loading}
          containerStyle={[styles.skeletonContainer, count > 1 && styles.repeated]}
          boneColor={colors.darkblack}
          highlightColor={colors.offwhite}
          animationType="shiver"
          layout={resolvedLayout}
          animationDirection='diagonalDownRight'
          duration={1800}
        >
          {children ?? <View />}
        </Skeleton>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  skeletonContainer: {
    width: '100%',
  },
  repeated: {
    marginBottom: scales(16),
  },
});