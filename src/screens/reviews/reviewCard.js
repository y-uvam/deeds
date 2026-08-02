import React, { memo } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { colors, scales } from "../../utils";
import { fontFamily, appImages } from "../../assets";

export const ReviewCard = memo(({ item, onDelete, onMoviePress }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.movieTopRow}
        activeOpacity={0.85}
        onPress={() => onMoviePress(item)}
      >
        <Image
          source={item.poster || appImages.poster1}
          style={styles.posterImg}
          resizeMode="cover"
        />

        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.movieGenre} numberOfLines={1}>
            {item.genre}
          </Text>

          <View style={styles.ratingBadge}>
            <Image
              source={appImages.star}
              style={styles.starIcon}
              tintColor={colors.orange}
              resizeMode="contain"
            />
            <Text style={styles.ratingValue}>{item.rating || 5}.0</Text>
            <Text style={styles.ratingLabel}>Your Rating</Text>
          </View>
        </View>

        <View style={styles.actionsCol}>
          <TouchableOpacity
            style={[styles.iconBtn, styles.deleteBtn]}
            activeOpacity={0.7}
            onPress={() => onDelete(item.id, item.title)}
          >
            <Image
              source={appImages.bin}
              style={styles.actionImg}
              tintColor={colors.storyRing}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      <Text style={styles.commentText}>{item.comment}</Text>
    </View>
  );
});

ReviewCard.displayName = "ReviewCard";

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite10,
    borderRadius: scales(18),
    padding: scales(14),
  },
  movieTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  posterImg: {
    width: scales(54),
    height: scales(74),
    borderRadius: scales(10),
    marginRight: scales(12),
  },
  movieInfo: {
    flex: 1,
    justifyContent: "space-between",
    height: scales(74),
    paddingVertical: scales(2),
  },
  movieTitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(16),
  },
  movieGenre: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(11),
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.orange + "1F",
    paddingHorizontal: scales(8),
    paddingVertical: scales(4),
    borderRadius: scales(8),
    alignSelf: "flex-start",
    gap: scales(5),
  },
  starIcon: {
    width: scales(13),
    height: scales(13),
  },
  ratingValue: {
    color: colors.orange,
    fontFamily: fontFamily.bold,
    fontSize: scales(12),
  },
  ratingLabel: {
    color: colors.orange,
    fontFamily: fontFamily.regular,
    fontSize: scales(11),
  },
  actionsCol: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: scales(32),
    height: scales(32),
    borderRadius: scales(16),
    backgroundColor: colors.transparentWhite10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: colors.lightRed + "1A",
  },
  actionImg: {
    width: scales(14),
    height: scales(14),
  },
  divider: {
    height: 1,
    backgroundColor: colors.transparentWhite8,
    marginVertical: scales(12),
  },
  commentText: {
    color: colors.white,
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
    lineHeight: scales(20),
  },
});
