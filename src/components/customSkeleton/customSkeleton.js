import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import { colors, height, scales } from '../../utils';

const { width } = Dimensions.get('window');

const LAYOUTS = {
  listItem: [
{
  key: 'main',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: scales(16),
  paddingVertical: scales(12),
  children: [
    {
      key: 'avatar',
      width: scales(44),
      height: scales(44),
      borderRadius: scales(22),
    },
    {
      key: 'content',
      flex: 1,
      marginLeft: scales(12),
      children: [
        {
          key: 'line1',
          width: width * 0.5,
          height: scales(13),
          borderRadius: scales(6),
          marginBottom: scales(6),
        },
        {
          key: 'line2',
          width: width * 0.35,
          height: scales(11),
          borderRadius: scales(6),
        },
      ],
    },
  ],
}
  ],
  card: [
    { key: 'banner',   width: '100%', height: height*0.35, borderRadius: scales(16), marginBottom: scales(12) },
    // {
    //   key: 'tags',
    //   flexDirection: 'row',
    //   marginBottom: scales(12),
    //   children: [
    //     { key: 't1', width: scales(40), height: scales(40), borderRadius: scales(20), marginRight: scales(8) },
    //     { key: 't2', width: scales(40), height: scales(40), borderRadius: scales(20), marginRight: scales(8) },
    //     { key: 't3', width: scales(40), height: scales(40), borderRadius: scales(20), marginRight: scales(8) },
    //   ],
    // },
    { key: 'title',    width: width * 0.55, height: scales(14), borderRadius: scales(6), marginBottom: scales(8) },
    { key: 'subtitle', width: width * 0.8, height: scales(11), borderRadius: scales(6), marginBottom: scales(5) },
    { key: 'subtitle', width: width * 0.8, height: scales(11), borderRadius: scales(6), marginBottom: scales(16) },
  ],
 profile: [
  {
    key: 'header',
    alignItems: 'center',
    marginBottom: scales(20),
    children: [
      {
        key: 'profilePic',
        width: scales(72),
        height: scales(72),
        borderRadius: scales(36),
        marginBottom: scales(14),
      },
      {
        key: 'name',
        width: width * 0.45,
        height: scales(16),
        borderRadius: scales(8),
        marginBottom: scales(10),
      },
      {
        key: 'bio1',
        width: width * 0.65,
        height: scales(12),
        borderRadius: scales(6),
        marginBottom: scales(6),
      },
      {
        key: 'bio2',
        width: width * 0.5,
        height: scales(12),
        borderRadius: scales(6),
      },
    ],
  },

  {
    key: 'stats',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: scales(20),
    children: [
      {
        key: 'stat1',
        alignItems: 'center',
        children: [
          {
            key: 'statValue1',
            width: scales(40),
            height: scales(14),
            borderRadius: scales(6),
            marginBottom: scales(6),
          },
          {
            key: 'statLabel1',
            width: scales(55),
            height: scales(10),
            borderRadius: scales(6),
          },
        ],
      },

      {
        key: 'stat2',
        alignItems: 'center',
        children: [
          {
            key: 'statValue2',
            width: scales(40),
            height: scales(14),
            borderRadius: scales(6),
            marginBottom: scales(6),
          },
          {
            key: 'statLabel2',
            width: scales(55),
            height: scales(10),
            borderRadius: scales(6),
          },
        ],
      },

      {
        key: 'stat3',
        alignItems: 'center',
        children: [
          {
            key: 'statValue3',
            width: scales(40),
            height: scales(14),
            borderRadius: scales(6),
            marginBottom: scales(6),
          },
          {
            key: 'statLabel3',
            width: scales(55),
            height: scales(10),
            borderRadius: scales(6),
          },
        ],
      },
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