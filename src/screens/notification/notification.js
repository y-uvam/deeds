import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AppBackground, Header } from "../../components";
import { colors, scales } from "../../utils";
import { fontFamily, appImages } from "../../assets";
import Animated, { FadeInDown } from "react-native-reanimated";

const CATEGORIES = [
  { key: "all", label: "All", icon: appImages.bell },
  { key: "likes", label: "Likes", icon: appImages.heart },
  { key: "comments", label: "Comments", icon: appImages.comment },
  { key: "ratings", label: "Ratings", icon: appImages.star },
  { key: "mentions", label: "Mentions", icon: appImages.mention },
  { key: "followers", label: "Followers", icon: appImages.follow },
  { key: "monetization", label: "Finance", icon: appImages.monetize },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "n1",
    type: "likes",
    user: "mike_builds",
    action: "appreciated your recent Slate 'Cinematography Essentials'",
    time: "2m ago",
    read: false,
    icon: appImages.heart,
    badgeColor: colors.red,
    postImg: appImages.poster1,
  },
  {
    id: "n2",
    type: "ratings",
    user: "jessica_art",
    action: "left a review on your short film 'Neon Dreams'",
    highlightText: '"Masterpiece of visual storytelling!"',
    time: "15m ago",
    read: false,
    icon: appImages.star,
    badgeColor: colors.yellow,
    rating: "5.0 ★",
  },
  {
    id: "n3",
    type: "comments",
    user: "david_ux",
    action: "commented on your Bite showcase",
    highlightText: '"How did you grade those color tones so smoothly?"',
    time: "1h ago",
    read: false,
    icon: appImages.comment,
    badgeColor: colors.blue,
    postImg: appImages.poster2,
  },
  {
    id: "n4",
    type: "monetization",
    user: "sarah_creates",
    action: "sent a tip to your Studio Vault during livestream",
    time: "3h ago",
    read: true,
    icon: appImages.monetize,
    badgeColor: colors.lightGreen || colors.green,
    amount: "$50",
  },
  {
    id: "n5",
    type: "mentions",
    user: "emma_studio",
    action: "mentioned you in a collaborative Project",
    highlightText: '"Seeking VFX crew members for indie feature"',
    time: "5h ago",
    read: true,
    icon: appImages.mention,
    badgeColor: colors.pink || colors.lightRed,
    postImg: appImages.poster3,
  },
  {
    id: "n6",
    type: "followers",
    user: "chris_director",
    action: "started following your filmmaker profile",
    time: "1d ago",
    read: true,
    icon: appImages.follow,
    badgeColor: colors.blue,
    isFollow: true,
    isFollowing: false,
  },
  {
    id: "n7",
    type: "ratings",
    user: "film_critique",
    action: "rated your film project 'Shadows & Sound'",
    highlightText: '"Incredible sound design and lighting atmosphere."',
    time: "1d ago",
    read: true,
    icon: appImages.star,
    badgeColor: colors.yellow,
    rating: "4.5 ★",
  },
  {
    id: "n8",
    type: "comments",
    user: "lucas_vfx",
    action: "replied to your discussion on rendering pipelines",
    highlightText: '"Totally agree, workflow automation saves hours!"',
    time: "2d ago",
    read: true,
    icon: appImages.comment,
    badgeColor: colors.blue,
    postImg: appImages.poster4,
  },
  {
    id: "n9",
    type: "likes",
    user: "claire_lens",
    action: "and 142 others liked your behind-the-scenes Reel",
    time: "3d ago",
    read: true,
    icon: appImages.heart,
    badgeColor: colors.red,
    postImg: appImages.poster1,
  },
  {
    id: "n10",
    type: "mentions",
    user: "neo_visuals",
    action: "tagged you in a new Slate collection",
    time: "4d ago",
    read: true,
    icon: appImages.tag,
    badgeColor: colors.purple || colors.magenta,
    postImg: appImages.poster2,
  },
  {
    id: "n11",
    type: "followers",
    user: "ava_cinematics",
    action: "started following you",
    time: "5d ago",
    read: true,
    icon: appImages.follow,
    badgeColor: colors.blue,
    isFollow: true,
    isFollowing: true,
  },
];

const NotificationCard = ({ item, index, onPress, onToggleFollow }) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 40, 300)).springify()}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress(item.id)}
        style={[styles.card, !item.read && styles.cardUnread]}
      >
        <View style={styles.cardLeft}>
          <View style={styles.avatarContainer}>
            <Image source={appImages.dummyuser} style={styles.avatarImage} />
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: item.badgeColor || colors.blue },
              ]}
            >
              <Image source={item.icon} style={styles.badgeIcon} />
            </View>
          </View>
        </View>

        <View style={styles.cardCenter}>
          <Text style={styles.contentText} numberOfLines={2}>
            <Text style={styles.userText}>@{item.user}</Text>{" "}
            <Text style={styles.actionText}>{item.action}</Text>
          </Text>
          {item.highlightText ? (
            <Text style={styles.quoteText} numberOfLines={1}>
              {item.highlightText}
            </Text>
          ) : null}
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        <View style={styles.cardRight}>
          {!item.read && <View style={styles.unreadDot} />}
          {item.isFollow ? (
            <TouchableOpacity
              style={[
                styles.followBtn,
                item.isFollowing && styles.followingBtn,
              ]}
              onPress={() => onToggleFollow(item.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.followBtnText,
                  item.isFollowing && styles.followingBtnText,
                ]}
              >
                {item.isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          ) : item.rating ? (
            <View style={styles.ratingChip}>
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          ) : item.amount ? (
            <View style={styles.amountChip}>
              <Text style={styles.amountText}>{item.amount}</Text>
            </View>
          ) : item.postImg ? (
            <Image source={item.postImg} style={styles.postThumb} />
          ) : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const Notification = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handleNotificationPress = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }, []);

  const handleToggleFollow = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isFollowing: !item.isFollowing, read: true }
          : item,
      ),
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const filteredNotifications =
    selectedCategory === "all"
      ? notifications
      : notifications.filter((item) => item.type === selectedCategory);

  const hasUnread = notifications.some((n) => !n.read);

  const renderItem = useCallback(
    ({ item, index }) => (
      <NotificationCard
        item={item}
        index={index}
        onPress={handleNotificationPress}
        onToggleFollow={handleToggleFollow}
      />
    ),
    [handleNotificationPress, handleToggleFollow],
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image source={appImages.bell} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No Notifications Here</Text>
      <Text style={styles.emptySubText}>
        We haven't found any{" "}
        {selectedCategory === "all" ? "" : selectedCategory} activity to show
        right now.
      </Text>
    </View>
  );

  return (
    <AppBackground>
      <Header label="Notifications" showBackButton={true} filterIcon={false} />

      {/* Category Filters */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryPill,
                  isActive && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(cat.key)}
                activeOpacity={0.7}
              >
                <Image
                  source={cat.icon}
                  style={[
                    styles.categoryIcon,
                    isActive && styles.categoryIconActive,
                  ]}
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    isActive && styles.categoryLabelActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => `${selectedCategory}_${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    width: "100%",
  },
  categoryScroll: {
    paddingHorizontal: scales(16),
    paddingVertical: scales(12),
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.transparentWhite5,
    paddingHorizontal: scales(14),
    paddingVertical: scales(8),
    borderRadius: scales(20),
    marginRight: scales(10),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.transparentWhite12,
  },
  categoryPillActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  categoryIcon: {
    width: scales(15),
    height: scales(15),
    marginRight: scales(6),
    tintColor: colors.transparentWhite85,
    resizeMode: "contain",
  },
  categoryIconActive: {
    tintColor: colors.white,
  },
  categoryLabel: {
    fontFamily: fontFamily.medium,
    fontSize: scales(13),
    color: colors.transparentWhite85,
  },
  categoryLabelActive: {
    fontFamily: fontFamily.bold,
    color: colors.white,
  },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scales(20),
    paddingBottom: scales(10),
    paddingTop: scales(4),
  },
  filterSummaryText: {
    fontFamily: fontFamily.semiBold,
    fontSize: scales(12),
    color: colors.transparentWhite40,
    letterSpacing: 0.5,
  },
  markReadText: {
    fontFamily: fontFamily.medium,
    fontSize: scales(13),
    color: colors.blue,
  },
  listContent: {
    paddingHorizontal: scales(16),
    paddingBottom: scales(100),
    gap: scales(10),
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.transparentWhite5,
    paddingHorizontal: scales(14),
    paddingVertical: scales(14),
    borderRadius: scales(16),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.transparentWhite8,
  },
  cardUnread: {
    backgroundColor: "rgba(0, 136, 255, 0.08)",
    borderColor: "rgba(0, 136, 255, 0.28)",
  },
  cardLeft: {
    marginRight: scales(12),
  },
  avatarContainer: {
    width: scales(48),
    height: scales(48),
    position: "relative",
  },
  avatarImage: {
    width: scales(46),
    height: scales(46),
    borderRadius: scales(23),
  },
  typeBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: scales(20),
    height: scales(20),
    borderRadius: scales(10),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  badgeIcon: {
    width: scales(10),
    height: scales(10),
    tintColor: colors.white,
    resizeMode: "contain",
  },
  cardCenter: {
    flex: 1,
    justifyContent: "center",
  },
  contentText: {
    fontSize: scales(13),
    lineHeight: scales(19),
  },
  userText: {
    fontFamily: fontFamily.bold,
    color: colors.white,
  },
  actionText: {
    fontFamily: fontFamily.regular,
    color: colors.transparentWhite85,
  },
  quoteText: {
    fontFamily: fontFamily.medium,
    fontSize: scales(12),
    color: colors.transparentWhite40,
    fontStyle: "italic",
    marginTop: scales(4),
  },
  timeText: {
    fontFamily: fontFamily.medium,
    fontSize: scales(11),
    color: colors.transparentWhite40,
    marginTop: scales(4),
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: scales(10),
  },
  unreadDot: {
    width: scales(8),
    height: scales(8),
    borderRadius: scales(4),
    backgroundColor: colors.blue,
    marginRight: scales(8),
  },
  postThumb: {
    width: scales(44),
    height: scales(44),
    borderRadius: scales(8),
    resizeMode: "cover",
  },
  followBtn: {
    backgroundColor: colors.blue,
    paddingHorizontal: scales(12),
    paddingVertical: scales(7),
    borderRadius: scales(16),
  },
  followingBtn: {
    backgroundColor: colors.transparentWhite12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.transparentWhite40,
  },
  followBtnText: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(12),
  },
  followingBtnText: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.medium,
  },
  ratingChip: {
    backgroundColor: "rgba(255, 193, 7, 0.15)",
    paddingHorizontal: scales(10),
    paddingVertical: scales(6),
    borderRadius: scales(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.yellow,
  },
  ratingText: {
    color: colors.yellow,
    fontFamily: fontFamily.bold,
    fontSize: scales(12),
  },
  amountChip: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    paddingHorizontal: scales(10),
    paddingVertical: scales(6),
    borderRadius: scales(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.green,
  },
  amountText: {
    color: colors.green,
    fontFamily: fontFamily.bold,
    fontSize: scales(13),
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: scales(60),
    paddingHorizontal: scales(40),
  },
  emptyIcon: {
    width: scales(54),
    height: scales(54),
    tintColor: colors.transparentWhite40,
    marginBottom: scales(16),
    resizeMode: "contain",
  },
  emptyTitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(18),
    marginBottom: scales(8),
  },
  emptySubText: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(14),
    textAlign: "center",
    lineHeight: scales(20),
  },
});
