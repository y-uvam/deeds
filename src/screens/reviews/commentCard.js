import React, { memo } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { colors, scales } from "../../utils";
import { fontFamily, appImages } from "../../assets";
import { Spacer } from "../../components";

export const CommentCard = memo(({ item, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.topicInfo}>
          <Text style={styles.topicTitle} numberOfLines={1}>
            {item.topicTitle}
          </Text>
          <Text style={styles.replyTarget}>
            In reply to{" "}
            <Text style={styles.targetAuthor}>{item.targetAuthor}</Text>
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.iconBtn, styles.deleteBtn]}
            activeOpacity={0.7}
            onPress={() => onDelete(item.id, item.topicTitle)}
          >
            <Image
              source={appImages.bin}
              style={styles.actionImg}
              tintColor={colors.storyRing}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Spacer height={scales(12)} />

      <View style={styles.commentBubble}>
        <Text style={styles.commentText}>{item.comment}</Text>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.dateText}>Commented {item.date}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Image
              source={appImages.like}
              style={styles.statImg}
              tintColor={colors.transparentWhite40}
              resizeMode="contain"
            />
            <Text style={styles.statNum}>{item.likes || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Image
              source={appImages.comment}
              style={styles.statImg}
              tintColor={colors.transparentWhite40}
              resizeMode="contain"
            />
            <Text style={styles.statNum}>{item.replies || 0} Replies</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

CommentCard.displayName = "CommentCard";

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite10,
    borderRadius: scales(18),
    padding: scales(16),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  topicInfo: {
    flex: 1,
    paddingRight: scales(8),
  },
  topicTitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(14),
  },
  replyTarget: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(11),
    marginTop: scales(2),
  },
  targetAuthor: {
    color: colors.blue,
    fontFamily: fontFamily.semiBold,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    width: scales(30),
    height: scales(30),
    borderRadius: scales(15),
    backgroundColor: colors.transparentWhite10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: colors.lightRed + "1A",
  },
  actionImg: {
    width: scales(13),
    height: scales(13),
  },
  commentBubble: {
    backgroundColor: colors.transparentWhite5,
    padding: scales(14),
    borderRadius: scales(10),
  },
  commentText: {
    color: colors.white,
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
    lineHeight: scales(20),
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: scales(12),
  },
  dateText: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.medium,
    fontSize: scales(11),
  },
  statsRow: {
    flexDirection: "row",
    gap: scales(16),
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(5),
  },
  statImg: {
    width: scales(14),
    height: scales(14),
  },
  statNum: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(11),
  },
});
