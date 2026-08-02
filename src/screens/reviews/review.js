import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import { AppBackground, Header, Spacer } from "../../components";
import { colors, scales, commonText } from "../../utils";
import { fontFamily, appImages } from "../../assets";
import { showCustomMessage } from "../../helper/FlashMessage";
import { navigate, routesConstants } from "../../navigation";
import { ReviewCard } from "./reviewCard";
import { CommentCard } from "./commentCard";

const DUMMY_RATINGS_HISTORY = [
  {
    id: "rev_1",
    title: "Dhanda Empire",
    genre: "Crime • Drama • 2026",
    poster: appImages.poster1,
    rating: 5,
    date: "2 days ago",
    comment:
      "An absolute masterpiece of modern cinema. The world-building and lead performances held my attention from the very first frame to the credits.",
    likes: 42,
    commentsCount: 8,
  },
  {
    id: "rev_2",
    title: "Silent Horizon",
    genre: "Sci-Fi • Mystery • 2025",
    poster: appImages.poster2,
    rating: 4,
    date: "1 week ago",
    comment:
      "Incredible visual effects and breathtaking sound design. The pacing in the second act was a bit slow, but the mind-bending finale made it totally worth it.",
    likes: 19,
    commentsCount: 3,
  },
  {
    id: "rev_3",
    title: "The Last Shadow",
    genre: "Action • Thriller • 2025",
    poster: appImages.poster3,
    rating: 5,
    date: "3 weeks ago",
    comment:
      "Unmatched stunt choreographies and phenomenal soundtrack! Truly best-in-class action sequences that rival top Hollywood blockbusters.",
    likes: 65,
    commentsCount: 14,
  },
  {
    id: "rev_4",
    title: "Galactic Chronicles",
    genre: "Adventure • Sci-Fi • 2024",
    poster: appImages.poster4,
    rating: 3,
    date: "1 month ago",
    comment:
      "Great world concepts and costumes, but the script felt a bit scattered. Still an enjoyable popcorn movie for fans of the genre.",
    likes: 11,
    commentsCount: 2,
  },
];

const DUMMY_COMMENTS_HISTORY = [
  {
    id: "com_1",
    topicTitle: "Next-gen Cinema V13 Camera Rigging & Setup",
    targetAuthor: "@cinemaster_dan",
    date: "3 hours ago",
    comment:
      "Has anyone tested this rig with the 35mm anamorphic lens? Interested in how the balance holds up during handheld gimbal tracking shots.",
    likes: 24,
    replies: 5,
  },
  {
    id: "com_2",
    topicTitle: "Behind the scenes of 'Dhanda Empire' final shoot",
    targetAuthor: "@virtue_studios",
    date: "1 day ago",
    comment:
      "The practical fire lighting in that warehouse sequence looked unreal! Huge props to the gaffer and lighting department.",
    likes: 89,
    replies: 12,
  },
  {
    id: "com_3",
    topicTitle: "Audio Mastering Workflow for Dolby Atmos Releases",
    targetAuthor: "@audio_guru",
    date: "4 days ago",
    comment:
      "Great tutorial! Saving this for our next feature film sound mix. The low-end frequency tip saved us countless hours.",
    likes: 45,
    replies: 3,
  },
  {
    id: "com_4",
    topicTitle: "Top 5 Color Grading LUTs for sci-fi environments",
    targetAuthor: "@colorist_max",
    date: "2 weeks ago",
    comment:
      "I've been using LUT #3 on my sci-fi short film and the neon cyan/orange separation is truly eye-catching!",
    likes: 15,
    replies: 1,
  },
];

export const Reviews = ({ route }) => {
  const isCommentsOnly = route?.params?.type === "comments";
  const headerTitle = isCommentsOnly
    ? "My Comments"
    : commonText.ratings || "Ratings & Reviews";

  const [listData, setListData] = useState(() =>
    isCommentsOnly ? DUMMY_COMMENTS_HISTORY : DUMMY_RATINGS_HISTORY,
  );

  const handleDeleteItem = useCallback(
    (id, title) => {
      setListData((prev) => prev.filter((item) => item.id !== id));
      const targetLabel = title ? `for "${title}"` : "";
      showCustomMessage(
        isCommentsOnly
          ? `Removed comment ${targetLabel}`
          : `Removed review ${targetLabel}`,
        "success",
      );
    },
    [isCommentsOnly],
  );

  const handleMoviePress = useCallback((item) => {
    navigate(routesConstants.ratings, { item: { title: item.title } });
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      if (isCommentsOnly) {
        return <CommentCard item={item} onDelete={handleDeleteItem} />;
      }
      return (
        <ReviewCard
          item={item}
          onDelete={handleDeleteItem}
          onMoviePress={handleMoviePress}
        />
      );
    },
    [isCommentsOnly, handleDeleteItem, handleMoviePress],
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <Text style={styles.pageDescription}>
          {isCommentsOnly
            ? "Manage all the comments and replies you've posted across movie slates, community discussions, and threads."
            : "Your complete history of movie ratings, reviews, and cinema critiques across Virtue studios."}
        </Text>
        <Spacer height={scales(14)} />
      </View>
    ),
    [isCommentsOnly],
  );

  const renderEmptyList = useCallback(
    () => (
      <View style={styles.emptyBox}>
        <Image
          source={isCommentsOnly ? appImages.comment : appImages.star}
          style={styles.emptyImg}
          tintColor={colors.transparentWhite30}
          resizeMode="contain"
        />
        <Spacer height={scales(12)} />
        <Text style={styles.emptyTitle}>
          {isCommentsOnly ? "No Comments Found" : "No Reviews Found"}
        </Text>
        <Text style={styles.emptyDesc}>
          {isCommentsOnly
            ? "You haven't dropped any comments across discussions yet."
            : "You haven't left any movie ratings or reviews yet."}
        </Text>
      </View>
    ),
    [isCommentsOnly],
  );

  const keyExtractor = useCallback((item) => item.id, []);
  const itemSeparator = useCallback(() => <Spacer height={scales(16)} />, []);

  return (
    <AppBackground>
      <Header label={headerTitle} showBackButton={true} />

      <FlatList
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={itemSeparator}
        removeClippedSubviews={true}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: scales(16),
    paddingTop: scales(8),
    paddingBottom: scales(40),
  },
  headerContainer: {
    marginTop: scales(4),
  },
  pageDescription: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
    lineHeight: scales(19),
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scales(60),
  },
  emptyImg: {
    width: scales(48),
    height: scales(48),
  },
  emptyTitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(16),
  },
  emptyDesc: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
    marginTop: scales(4),
    textAlign: "center",
  },
});

