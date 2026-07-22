import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { colors, height, scales } from "../../utils";

const { width } = Dimensions.get("window");

const LAYOUTS = {
  listItem: [
    {
      key: "main",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: scales(16),
      paddingVertical: scales(12),
      children: [
        {
          key: "avatar",
          width: scales(44),
          height: scales(44),
          borderRadius: scales(22),
        },
        {
          key: "content",
          flex: 1,
          marginLeft: scales(12),
          children: [
            {
              key: "line1",
              width: width * 0.5,
              height: scales(13),
              borderRadius: scales(6),
              marginBottom: scales(6),
            },
            {
              key: "line2",
              width: width * 0.35,
              height: scales(11),
              borderRadius: scales(6),
            },
          ],
        },
      ],
    },
  ],
  comment: [
    {
      key: "main",
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: scales(20),
      children: [
        {
          key: "avatar",
          width: scales(36),
          height: scales(36),
          borderRadius: scales(18),
          marginRight: scales(12),
        },
        {
          key: "content",
          flex: 1,
          paddingRight: scales(10),
          children: [
            {
              key: "username",
              width: width * 0.3,
              height: scales(12),
              borderRadius: scales(4),
              marginBottom: scales(8),
            },
            {
              key: "commentText",
              width: width * 0.65,
              height: scales(12),
              borderRadius: scales(4),
              marginBottom: scales(10),
            },
            {
              key: "reply",
              width: width * 0.2,
              height: scales(10),
              borderRadius: scales(4),
            },
          ],
        },
        {
          key: "likeBtn",
          width: scales(40),
          alignItems: "center",
          paddingTop: scales(4),
          children: [
            {
              key: "heart",
              width: scales(16),
              height: scales(16),
              borderRadius: scales(8),
              marginBottom: scales(6),
            },
            {
              key: "count",
              width: scales(20),
              height: scales(8),
              borderRadius: scales(4),
            },
          ],
        },
      ],
    },
  ],
  card: [
    {
      key: "header",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: scales(10),
      marginBottom: scales(10),
      children: [
        {
          key: "avatar",
          width: scales(40),
          height: scales(40),
          borderRadius: scales(20),
        },
        {
          key: "name",
          width: width * 0.35,
          height: scales(14),
          borderRadius: scales(6),
          marginLeft: scales(10),
        },
      ],
    },
    {
      key: "banner",
      width: "100%",
      height: scales(300),
      marginBottom: scales(12),
    },
    {
      key: "actions",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: scales(14),
      marginBottom: scales(12),
      children: [
        {
          key: "leftActions",
          flexDirection: "row",
          children: [
            {
              key: "like",
              width: scales(24),
              height: scales(24),
              borderRadius: scales(12),
              marginRight: scales(20),
            },
            {
              key: "comment",
              width: scales(24),
              height: scales(24),
              borderRadius: scales(12),
              marginRight: scales(20),
            },
            {
              key: "share",
              width: scales(24),
              height: scales(24),
              borderRadius: scales(12),
            },
          ],
        },
        {
          key: "save",
          width: scales(20),
          height: scales(24),
          borderRadius: scales(10),
        },
      ],
    },
    {
      key: "descLine1",
      width: width * 0.85,
      height: scales(12),
      borderRadius: scales(6),
      marginBottom: scales(6),
      marginLeft: scales(14),
    },
    {
      key: "descLine2",
      width: width * 0.5,
      height: scales(12),
      borderRadius: scales(6),
      marginBottom: scales(20),
      marginLeft: scales(14),
    },
  ],
  profile: [
    {
      key: "cover",
      width: "100%",
      height: scales(220),
      marginBottom: scales(-40),
    },
    {
      key: "profileCard",
      alignItems: "flex-start",
      paddingHorizontal: scales(20),
      children: [
        {
          key: "avatarRow",
          flexDirection: "row",
          alignItems: "flex-end",
          width: "100%",
          marginBottom: scales(20),
          children: [
            {
              key: "avatar",
              width: scales(100),
              height: scales(100),
              borderRadius: scales(50),
            },
            {
              key: "btn1",
              width: scales(100),
              height: scales(40),
              borderRadius: scales(20),
              marginLeft: "auto",
              marginRight: scales(10),
            },
            {
              key: "btn2",
              width: scales(40),
              height: scales(40),
              borderRadius: scales(20),
            },
          ],
        },
        {
          key: "name",
          width: width * 0.5,
          height: scales(24),
          borderRadius: scales(12),
          marginBottom: scales(15),
        },
        {
          key: "bio1",
          width: width * 0.8,
          height: scales(14),
          borderRadius: scales(7),
          marginBottom: scales(8),
        },
        {
          key: "bio2",
          width: width * 0.6,
          height: scales(14),
          borderRadius: scales(7),
          marginBottom: scales(20),
        },
        {
          key: "stats",
          width: "100%",
          height: scales(70),
          borderRadius: scales(20),
          marginBottom: scales(30),
        },
        {
          key: "highTitle",
          width: scales(120),
          height: scales(18),
          borderRadius: scales(9),
          marginBottom: scales(15),
        },
        {
          key: "highlightsRow",
          flexDirection: "row",
          marginBottom: scales(30),
          children: [
            {
              key: "h1",
              width: scales(65),
              height: scales(65),
              borderRadius: scales(33),
              marginRight: scales(12),
            },
            {
              key: "h2",
              width: scales(65),
              height: scales(65),
              borderRadius: scales(33),
              marginRight: scales(12),
            },
            {
              key: "h3",
              width: scales(65),
              height: scales(65),
              borderRadius: scales(33),
              marginRight: scales(12),
            },
            {
              key: "h4",
              width: scales(65),
              height: scales(65),
              borderRadius: scales(33),
              marginRight: scales(12),
            },
          ],
        },
        {
          key: "tabs",
          width: "100%",
          height: scales(45),
          borderRadius: scales(22),
          marginBottom: scales(20),
        },
      ],
    },
  ],
  text: [
    {
      key: "tx1",
      width: "100%",
      height: scales(12),
      borderRadius: scales(6),
      marginBottom: scales(8),
    },
    {
      key: "tx2",
      width: "100%",
      height: scales(12),
      borderRadius: scales(6),
      marginBottom: scales(8),
    },
    {
      key: "tx3",
      width: width * 0.8,
      height: scales(12),
      borderRadius: scales(6),
      marginBottom: scales(8),
    },
    {
      key: "tx4",
      width: "100%",
      height: scales(12),
      borderRadius: scales(6),
      marginBottom: scales(8),
    },
    {
      key: "tx5",
      width: width * 0.6,
      height: scales(12),
      borderRadius: scales(6),
    },
  ],
  browse: [
    {
      key: "browseRow",
      flexDirection: "row",
      paddingHorizontal: scales(1),
      children: [
        {
          key: "item1",
          width: (width - 6) / 3,
          height: (width - 6) / 3,
          margin: 0.7,
        },
        {
          key: "item2",
          width: (width - 6) / 3,
          height: (width - 6) / 3,
          margin: 0.7,
        },
        {
          key: "item3",
          width: (width - 6) / 3,
          height: (width - 6) / 3,
          margin: 0.7,
        },
      ],
    },
  ],
  browseFeaturedLeft: [
    {
      key: "featuredLeftRoot",
      flexDirection: "row",
      paddingHorizontal: scales(1),
      children: [
        {
          key: "bigItem",
          width: ((width - 6) / 3) * 2 + 1.4,
          height: ((width - 6) / 3) * 2 + 1.4,
          margin: 0.7,
        },
        {
          key: "smallItemsColumn",
          flexDirection: "column",
          children: [
            {
              key: "small1",
              width: (width - 6) / 3,
              height: (width - 6) / 3,
              margin: 0.7,
            },
            {
              key: "small2",
              width: (width - 6) / 3,
              height: (width - 6) / 3,
              margin: 0.7,
            },
          ],
        },
      ],
    },
  ],
  browseFeaturedRight: [
    {
      key: "featuredRightRoot",
      flexDirection: "row",
      paddingHorizontal: scales(1),
      children: [
        {
          key: "smallItemsColumn",
          flexDirection: "column",
          children: [
            {
              key: "small1",
              width: (width - 6) / 3,
              height: (width - 6) / 3,
              margin: 0.7,
            },
            {
              key: "small2",
              width: (width - 6) / 3,
              height: (width - 6) / 3,
              margin: 0.7,
            },
          ],
        },
        {
          key: "bigItem",
          width: ((width - 6) / 3) * 2 + 1.4,
          height: ((width - 6) / 3) * 2 + 1.4,
          margin: 0.7,
        },
      ],
    },
  ],
};
export const CustomSkeleton = ({
  variant = "card",
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
          containerStyle={[
            styles.skeletonContainer,
            count > 1 && styles.repeated,
          ]}
          boneColor={colors.profileBtnBg}
          highlightColor={colors.profileDivider}
          animationType="shiver"
          layout={resolvedLayout}
          animationDirection="diagonalDownRight"
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
    width: "100%",
  },
  skeletonContainer: {
    width: "100%",
  },
  repeated: {
    marginBottom: scales(16),
  },
});
