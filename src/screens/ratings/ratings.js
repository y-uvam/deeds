import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import {
  AppBackground,
  Header,
  Spacer,
  CustomBottomSheet,
  CustomButton,
  CustomInput,
} from "../../components";
import { colors, scales, commonText } from "../../utils";
import { fontFamily, appImages } from "../../assets";

const DUMMY_REVIEWS = [
  {
    id: "r1",
    name: "Alex Rivera",
    rating: 5,
    date: "2 hours ago",
    comment:
      "Absolute masterpiece! The cinematography and storytelling kept me on the edge of my seat throughout.",
    helpfulCount: 42,
    avatar: appImages.dummyuser,
  },
  {
    id: "r2",
    name: "Sarah Jenkins",
    rating: 5,
    date: "1 day ago",
    comment:
      "Incredible performances by the lead cast. A must-watch for anyone who loves intense thriller drama.",
    helpfulCount: 28,
    avatar: appImages.dummyuser,
  },
  {
    id: "r3",
    name: "Rohan Gupta",
    rating: 4,
    date: "3 days ago",
    comment:
      "Top notch direction and background music. The plot twists in the second half were unbelievable!",
    helpfulCount: 19,
    avatar: appImages.dummyuser,
  },
  {
    id: "r4",
    name: "Elena Rostova",
    rating: 5,
    date: "1 week ago",
    comment:
      "The visual effects and sound design are unmatched. Can't wait for the sequel!",
    helpfulCount: 35,
    avatar: appImages.dummyuser,
  },
  {
    id: "r5",
    name: "Marcus Vance",
    rating: 4,
    date: "2 weeks ago",
    comment:
      "Great pacing and character development. A solid cinema experience from start to finish.",
    helpfulCount: 12,
    avatar: appImages.dummyuser,
  },
];

const RATING_BREAKDOWN = [
  { stars: 5, percent: 78 },
  { stars: 4, percent: 14 },
  { stars: 3, percent: 5 },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 1 },
];

export const Ratings = ({ route }) => {
  const { item } = route?.params ?? {};
  const addRatingSheetRef = useRef(null);

  const [reviews, setReviews] = useState(DUMMY_REVIEWS);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");

  const movieTitle = item?.title ?? "Dhanda Empire";

  const handleOpenAddSheet = useCallback(() => {
    addRatingSheetRef.current?.present();
  }, []);

  const handleSubmitRating = useCallback(() => {
    if (!userComment.trim()) return;

    const newReview = {
      id: `r_${Date.now()}`,
      name: commonText.profileName ?? "You",
      rating: userRating,
      date: "Just now",
      comment: userComment,
      helpfulCount: 0,
      avatar: appImages.dummyuser,
    };

    setReviews([newReview, ...reviews]);
    setUserComment("");
    setUserRating(5);
    addRatingSheetRef.current?.dismiss();
  }, [userComment, userRating, reviews]);

  const filteredReviews = reviews.filter((r) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "5 Star") return r.rating === 5;
    if (selectedFilter === "4 Star") return r.rating === 4;
    return true;
  });

  const renderHeader = () => (
    <View style={styles.headerBlock}>
      <View style={styles.heroCard}>
        <View style={styles.scoreCol}>
          <Text style={styles.bigScoreText}>4.8</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Image
                key={s}
                source={appImages.star}
                style={styles.starIconImage}
                tintColor={colors.yellow}
                resizeMode="contain"
              />
            ))}
          </View>
          <Text style={styles.totalCountText}>1,248 Ratings</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.breakdownCol}>
          {RATING_BREAKDOWN.map((b) => (
            <View key={b.stars} style={styles.breakdownRow}>
              <Text style={styles.starLabel}>{b.stars}★</Text>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${b.percent}%` }]}
                />
              </View>
              <Text style={styles.percentText}>{b.percent}%</Text>
            </View>
          ))}
        </View>
      </View>

      <Spacer height={scales(16)} />

      <CustomButton
        label={"Rate Movie & Write Review"}
        onPress={handleOpenAddSheet}
      />
      <Spacer height={scales(20)} />

      <View style={styles.filterRow}>
        {["All", "5 Star", "4 Star"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              selectedFilter === f && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(f)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === f && styles.filterChipTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Spacer height={scales(12)} />
    </View>
  );

  const renderReviewItem = ({ item: r }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewTopRow}>
        <Image source={r.avatar} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{r.name}</Text>
          <Text style={styles.reviewDate}>{r.date}</Text>
        </View>
        <View style={styles.badgeRating}>
          <Image
            source={appImages.star}
            style={styles.badgeStarImage}
            tintColor={colors.yellow}
            resizeMode="contain"
          />
          <Text style={styles.badgeNum}>{r.rating}.0</Text>
        </View>
      </View>

      <Text style={styles.commentText}>{r.comment}</Text>

      <View style={styles.reviewBottomRow}>
        <Image
          source={appImages.like}
          style={styles.likeIconImage}
          tintColor={colors.transparentWhite40}
          resizeMode="contain"
        />
        <Text style={styles.helpfulText}>
          {r.helpfulCount} found this helpful
        </Text>
      </View>
    </View>
  );

  return (
    <AppBackground>
      <Header
        label={`${movieTitle} ${commonText.ratings}`}
        showBackButton={true}
      />

      <FlatList
        data={filteredReviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReviewItem}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <Spacer height={scales(12)} />}
      />

      <CustomBottomSheet
        ref={addRatingSheetRef}
        snapPoints={["60%"]}
        enablePanDownToClose={true}
        useBlur={true}
        showCloseButton={true}
        title="Add Rating"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          <Text style={styles.sheetSubtitle}>
            How would you rate {movieTitle}?
          </Text>

          <Spacer height={scales(14)} />

          <View style={styles.interactiveStarsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                activeOpacity={0.7}
                onPress={() => setUserRating(star)}
              >
                <Image
                  source={appImages.star}
                  style={styles.interactiveStarImage}
                  tintColor={
                    star <= userRating
                      ? colors.yellow
                      : colors.transparentWhite15
                  }
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>

          <Spacer height={scales(20)} />

          <Text style={styles.inputLabel}>Your Review</Text>
          <Spacer height={scales(6)} />
          <CustomInput
            placeholder="Share your thoughts about the story, acting, music..."
            value={userComment}
            onChangeText={setUserComment}
            multiline
            height={110}
          />

          <Spacer height={scales(24)} />

          <CustomButton
            label="Submit Review"
            onPress={handleSubmitRating}
            disable={!userComment.trim()}
          />
        </ScrollView>
      </CustomBottomSheet>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: scales(16),
    paddingBottom: scales(40),
  },
  headerBlock: {
    marginTop: scales(10),
  },
  heroCard: {
    flexDirection: "row",
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite10,
    borderRadius: scales(16),
    padding: scales(16),
    alignItems: "center",
  },
  scoreCol: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: scales(12),
  },
  bigScoreText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(34),
  },
  starsRow: {
    flexDirection: "row",
    gap: scales(3),
    marginVertical: scales(4),
  },
  starIconImage: {
    width: scales(12),
    height: scales(12),
  },
  totalCountText: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(11),
  },
  divider: {
    width: 1,
    height: "80%",
    backgroundColor: colors.transparentWhite12,
    marginHorizontal: scales(10),
  },
  breakdownCol: {
    flex: 1,
    gap: scales(4),
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(6),
  },
  starLabel: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.medium,
    fontSize: scales(11),
    width: scales(22),
  },
  progressTrack: {
    flex: 1,
    height: scales(6),
    backgroundColor: colors.transparentWhite10,
    borderRadius: scales(3),
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.yellow,
    borderRadius: scales(3),
  },
  percentText: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(10),
    width: scales(28),
    textAlign: "right",
  },
  addRatingBarBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.blue,
    borderRadius: scales(14),
    paddingVertical: scales(14),
    gap: scales(8),
  },
  plusIconImage: {
    width: scales(16),
    height: scales(16),
  },
  addRatingBtnText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(14),
  },
  filterRow: {
    flexDirection: "row",
    gap: scales(8),
  },
  filterChip: {
    paddingHorizontal: scales(14),
    paddingVertical: scales(7),
    borderRadius: scales(20),
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite12,
  },
  filterChipActive: {
    backgroundColor: colors.storyRing + "22",
    borderColor: colors.storyRing,
  },
  filterChipText: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.medium,
    fontSize: scales(12),
  },
  filterChipTextActive: {
    color: colors.storyRing,
    fontFamily: fontFamily.bold,
  },
  reviewCard: {
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite10,
    borderRadius: scales(14),
    padding: scales(14),
  },
  reviewTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: scales(36),
    height: scales(36),
    borderRadius: scales(18),
    marginRight: scales(10),
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(14),
  },
  reviewDate: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(10),
    marginTop: scales(2),
  },
  badgeRating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.yellow + "22",
    paddingHorizontal: scales(8),
    paddingVertical: scales(4),
    borderRadius: scales(8),
    gap: scales(4),
  },
  badgeStarImage: {
    width: scales(12),
    height: scales(12),
  },
  badgeNum: {
    color: colors.yellow,
    fontFamily: fontFamily.bold,
    fontSize: scales(12),
  },
  commentText: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
    lineHeight: scales(19),
    marginTop: scales(10),
  },
  reviewBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(6),
    marginTop: scales(10),
    paddingTop: scales(8),
    borderTopWidth: 1,
    borderTopColor: colors.transparentWhite8,
  },
  likeIconImage: {
    width: scales(14),
    height: scales(14),
  },
  helpfulText: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.medium,
    fontSize: scales(11),
  },
  sheetContent: {
    paddingHorizontal: scales(16),
    paddingBottom: scales(30),
  },
  sheetSubtitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(18),
    textAlign: "center",
  },
  interactiveStarsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scales(14),
  },
  interactiveStarImage: {
    width: scales(32),
    height: scales(32),
  },
  inputLabel: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(13),
  },
});
