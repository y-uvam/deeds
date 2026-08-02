import React, { useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  AppBackground,
  Header,
  Spacer,
  CustomBottomSheet,
} from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { navigate, goBack, routesConstants } from "../../navigation";
import { BlurView } from "@react-native-community/blur";
import LinearGradient from "react-native-linear-gradient";

const DUMMY_CAST_AND_CREW = [
  {
    id: "cr1",
    name: "Kabir Khan",
    role: "Director",
    image: appImages.dummyuser,
  },
  {
    id: "cr2",
    name: "Siddharth Roy",
    role: "Producer",
    image: appImages.dummyuser,
  },
  {
    id: "cr3",
    name: "Salim Khan",
    role: "Writer",
    image: appImages.dummyuser,
  },
  {
    id: "c1",
    name: "Aarav Sharma",
    role: "Lead Actor",
    image: appImages.dummyuser,
  },
  {
    id: "c2",
    name: "Rhea Kapoor",
    role: "Lead Actress",
    image: appImages.dummyuser,
  },
  {
    id: "c3",
    name: "Devendra Verma",
    role: "Antagonist",
    image: appImages.dummyuser,
  },
  {
    id: "c4",
    name: "Karan Johar",
    role: "Supporting",
    image: appImages.dummyuser,
  },
];

const DUMMY_REVIEWS = [
  {
    id: "r1",
    name: "Alex Rivera",
    rating: 5,
    date: "2 days ago",
    comment:
      "Absolute masterpiece! The cinematography and storytelling kept me on the edge of my seat throughout.",
  },
  {
    id: "r2",
    name: "Sarah Jenkins",
    rating: 4.5,
    date: "1 week ago",
    comment:
      "Incredible performances by the lead cast. A must-watch for anyone who loves intense thriller drama.",
  },
  {
    id: "r3",
    name: "Rohan Gupta",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Top notch direction and background music. The plot twists in the second half were unbelievable!",
  },
];

const DUMMY_TRAILERS = [
  {
    id: "t1",
    title: "Official Trailer",
    duration: "2:30",
    image: appImages.post,
  },
  {
    id: "t2",
    title: "BTS: Stunts & Action Sequences",
    duration: "3:45",
    image: appImages.post,
  },
  {
    id: "t3",
    title: "BTS: Director's Cut & Commentary",
    duration: "5:12",
    image: appImages.post,
  },
  {
    id: "t4",
    title: "BTS: VFX & Sound Breakdown",
    duration: "4:20",
    image: appImages.post,
  },
];

export const Movie = ({ route }) => {
  const { item } = route?.params ?? {};
  const ratingSheetRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const posterSource = item?.images?.[0] ?? {
    uri: "https://picsum.photos/seed/movie_poster/800/1000",
  };
  const titleText = item?.title ?? "Dhanda Empire";
  const descriptionText = item?.description ?? commonText.dummyText;

  const handleProfilePress = useCallback(() => {
    navigate(routesConstants.Profile);
  }, []);

  const openRatingSheet = useCallback(() => {
    ratingSheetRef.current?.present();
  }, []);

  return (
    <AppBackground>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroContainer}>
          <Image source={posterSource} style={styles.heroImage} />

          <LinearGradient
            colors={[
              "rgba(5, 14, 26, 0.85)",
              "rgba(5, 20, 36, 0.2)",
              "rgba(5, 20, 36, 0.98)",
            ]}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          <TouchableOpacity
            style={styles.floatingBackBtn}
            onPress={goBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <BlurView
              style={styles.backBlurCircle}
              blurType="dark"
              blurAmount={20}
              reducedTransparencyFallbackColor="rgba(15,15,15,0.9)"
            >
              <Image
                source={appImages.backarrow}
                style={styles.backIcon}
                tintColor={colors.white}
              />
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.heroPlayBtn}
            activeOpacity={0.85}
            onPress={() => navigate(routesConstants.video)}
          >
            <LinearGradient
              colors={[
                colors.orange,
                colors.storyRing,
                colors.lightRed,
                colors.purple,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playGradientCircle}
            >
              <Image
                source={appImages.play}
                style={styles.playIcon}
                tintColor={colors.white}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.movieTitle}>{titleText}</Text>
          <Text style={styles.movieTagline}>
            The rise and battle for supreme control.
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>2026</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>U/A 16+</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>2h 15m</Text>
            </View>
            <View style={styles.metaBadgeAccent}>
              <Text style={styles.metaBadgeAccentText}>4K Ultra HD</Text>
            </View>
          </View>

          <Spacer height={scales(8)} />

          <Text style={styles.sectionHeader}>Synopsis</Text>
          <Text style={styles.descriptionText}>{descriptionText}</Text>

          <Spacer height={scales(20)} />

          <View style={styles.ratingsCard}>
            <View style={styles.ratingScoreBox}>
              <Image
                source={appImages.star}
                style={styles.ratingStar}
                tintColor={colors.yellow}
                resizeMode="contain"
              />
              <Text style={styles.ratingScoreText}>4.8</Text>
              <Text style={styles.ratingMaxText}>/ 5.0</Text>
              <Text style={styles.ratingCountText}>(1.2k Ratings)</Text>
            </View>

            <TouchableOpacity
              style={styles.seeAllRatingsBtn}
              activeOpacity={0.8}
              onPress={() => navigate(routesConstants.ratings, { item })}
            >
              <Text style={styles.seeAllRatingsText}>See All Ratings</Text>
            </TouchableOpacity>
          </View>

          <Spacer height={scales(24)} />

          <Text style={styles.sectionHeader}>Cast & Crew</Text>
          <Spacer height={scales(10)} />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.castScroll}
          >
            {DUMMY_CAST_AND_CREW.map((person) => (
              <TouchableOpacity
                key={person.id}
                style={styles.actorCard}
                activeOpacity={0.8}
                onPress={handleProfilePress}
              >
                <Image source={person.image} style={styles.actorAvatar} />
                <Text style={styles.actorName} numberOfLines={1}>
                  {person.name}
                </Text>
                <Text style={styles.actorRole} numberOfLines={1}>
                  {person.role}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Spacer height={scales(24)} />

          <Text style={styles.sectionHeader}>Trailers & BTS</Text>
          <Spacer height={scales(12)} />

          <View style={styles.mainTrailerCard}>
            <Image
              source={DUMMY_TRAILERS[0].image}
              style={styles.trailerImage}
            />
            <View style={styles.trailerDimOverlay} />

            <View style={styles.trailerPlayCircle}>
              <Image
                source={appImages.play}
                style={styles.miniPlayIcon}
                tintColor={colors.white}
              />
            </View>

            <View style={styles.trailerContent}>
              <View style={styles.durationTag}>
                <Text style={styles.durationTagText}>
                  {DUMMY_TRAILERS[0].duration}
                </Text>
              </View>
              <Text style={styles.trailerTitle}>{DUMMY_TRAILERS[0].title}</Text>
            </View>
          </View>

          <Spacer height={scales(16)} />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.btsScroll}
          >
            {DUMMY_TRAILERS.slice(1).map((bts) => (
              <TouchableOpacity
                key={bts.id}
                style={styles.btsCard}
                activeOpacity={0.85}
              >
                <Image source={bts.image} style={styles.btsImage} />
                <View style={styles.btsDimOverlay} />

                <View style={styles.btsPlayCircle}>
                  <Image
                    source={appImages.play}
                    style={styles.miniPlayIcon}
                    tintColor={colors.white}
                  />
                </View>

                <View style={styles.btsDurationTag}>
                  <Text style={styles.durationTagText}>{bts.duration}</Text>
                </View>

                <Text style={styles.btsTitle} numberOfLines={2}>
                  {bts.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Spacer height={scales(30)} />
        </View>
      </ScrollView>

      <CustomBottomSheet
        ref={ratingSheetRef}
        snapPoints={["65%"]}
        enablePanDownToClose={true}
        useBlur={true}
        showCloseButton={true}
        title="Ratings & Reviews"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.reviewSheetContent}
        >
          <View style={styles.sheetHeaderScore}>
            <Text style={styles.sheetBigScore}>4.8</Text>
            <Text style={styles.sheetMaxScore}>out of 5.0</Text>
            <Text style={styles.sheetTotalRatings}>1,248 Verified Ratings</Text>
          </View>

          <Spacer height={scales(16)} />

          {DUMMY_REVIEWS.map((rev) => (
            <View key={rev.id} style={styles.reviewItem}>
              <View style={styles.reviewHeaderRow}>
                <Image
                  source={appImages.dummyuser}
                  style={styles.reviewAvatar}
                />
                <View style={styles.reviewHeaderMeta}>
                  <Text style={styles.reviewAuthor}>{rev.name}</Text>
                  <Text style={styles.reviewDate}>{rev.date}</Text>
                </View>
                <View style={styles.reviewBadge}>
                  <Text style={styles.reviewBadgeText}>⭐ {rev.rating}</Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{rev.comment}</Text>
            </View>
          ))}
        </ScrollView>
      </CustomBottomSheet>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: scales(40),
  },
  heroContainer: {
    width: "100%",
    height: scales(310),
    position: "relative",
    overflow: "hidden",
  },
  ratingStar: {
    height: scales(20),
    width: scales(20),
    resizeMode: "contain",
    tintColor: colors.yellow,
    marginRight: scales(10),
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  floatingBackBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? scales(48) : scales(36),
    left: scales(16),
    zIndex: 20,
  },
  backBlurCircle: {
    width: scales(38),
    height: scales(38),
    borderRadius: scales(19),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  backIcon: {
    width: scales(16),
    height: scales(16),
    resizeMode: "contain",
  },
  heroPlayBtn: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -scales(32),
    marginTop: -scales(32),
    width: scales(64),
    height: scales(64),
    borderRadius: scales(32),
    overflow: "hidden",
    shadowColor: colors.storyRing,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 10,
    zIndex: 15,
  },
  playGradientCircle: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    width: scales(24),
    height: scales(24),
    resizeMode: "contain",
    marginLeft: scales(3),
  },
  detailsContainer: {
    paddingHorizontal: scales(16),
    marginTop: scales(14),
  },
  movieTitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(24),
    letterSpacing: 0.2,
  },
  movieTagline: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
    marginTop: scales(4),
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(8),
    marginTop: scales(12),
    marginBottom: scales(4),
  },
  metaBadge: {
    backgroundColor: colors.transparentWhite10,
    paddingHorizontal: scales(10),
    paddingVertical: scales(4),
    borderRadius: scales(10),
    borderWidth: 1,
    borderColor: colors.transparentWhite12,
  },
  metaBadgeText: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.medium,
    fontSize: scales(11),
  },
  metaBadgeAccent: {
    backgroundColor: "rgba(245, 60, 109, 0.15)",
    paddingHorizontal: scales(10),
    paddingVertical: scales(4),
    borderRadius: scales(10),
    borderWidth: 1,
    borderColor: "rgba(245, 60, 109, 0.35)",
  },
  metaBadgeAccentText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(11),
  },
  sectionHeader: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(17),
  },
  subSectionHeader: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(14),
  },
  descriptionText: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
    lineHeight: scales(20),
    marginTop: scales(6),
  },
  ratingsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite10,
    borderRadius: scales(14),
    paddingHorizontal: scales(14),
    paddingVertical: scales(12),
  },
  ratingScoreBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    fontSize: scales(16),
    marginRight: scales(6),
  },
  ratingScoreText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(18),
  },
  ratingMaxText: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(12),
    marginLeft: scales(2),
  },
  ratingCountText: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(12),
    marginLeft: scales(8),
  },
  seeAllRatingsBtn: {
    backgroundColor: colors.transparentWhite10,
    paddingHorizontal: scales(12),
    paddingVertical: scales(6),
    borderRadius: scales(10),
  },
  seeAllRatingsText: {
    color: colors.blue,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(12),
  },
  crewList: {
    gap: scales(10),
  },
  crewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite10,
    borderRadius: scales(12),
    paddingHorizontal: scales(12),
    paddingVertical: scales(10),
    gap: scales(12),
  },
  crewAvatar: {
    width: scales(38),
    height: scales(38),
    borderRadius: scales(19),
  },
  crewInfo: {
    flex: 1,
  },
  crewRole: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(11),
  },
  crewName: {
    color: colors.blue,
    fontFamily: fontFamily.bold,
    fontSize: scales(14),
    marginTop: scales(2),
  },
  castScroll: {
    gap: scales(12),
  },
  actorCard: {
    width: scales(95),
    alignItems: "center",
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite10,
    borderRadius: scales(12),
    padding: scales(10),
  },
  actorAvatar: {
    width: scales(44),
    height: scales(44),
    borderRadius: scales(22),
    marginBottom: scales(8),
  },
  actorName: {
    color: colors.blue,
    fontFamily: fontFamily.bold,
    fontSize: scales(12),
    textAlign: "center",
  },
  actorRole: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(10),
    textAlign: "center",
    marginTop: scales(2),
  },
  mainTrailerCard: {
    width: "100%",
    height: scales(170),
    borderRadius: scales(16),
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.transparentWhite5,
  },
  trailerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  trailerDimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  trailerPlayCircle: {
    position: "absolute",
    top: scales(52),
    alignSelf: "center",
    width: scales(44),
    height: scales(44),
    borderRadius: scales(22),
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  miniPlayIcon: {
    width: scales(15),
    height: scales(15),
    resizeMode: "contain",
    marginLeft: scales(2),
  },
  trailerContent: {
    position: "absolute",
    bottom: scales(12),
    left: scales(12),
    right: scales(12),
    flexDirection: "row",
    alignItems: "center",
    gap: scales(8),
  },
  durationTag: {
    backgroundColor: colors.transparentBlack30,
    paddingHorizontal: scales(8),
    paddingVertical: scales(3),
    borderRadius: scales(6),
  },
  durationTagText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(10),
  },
  trailerTitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(13),
    flex: 1,
  },
  btsScroll: {
    gap: scales(12),
  },
  btsCard: {
    width: scales(160),
    height: scales(110),
    borderRadius: scales(12),
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.transparentWhite5,
  },
  btsImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  btsDimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  btsPlayCircle: {
    position: "absolute",
    top: scales(26),
    alignSelf: "center",
    width: scales(32),
    height: scales(32),
    borderRadius: scales(16),
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  btsDurationTag: {
    position: "absolute",
    top: scales(6),
    right: scales(6),
    backgroundColor: colors.transparentBlack30,
    paddingHorizontal: scales(6),
    paddingVertical: scales(2),
    borderRadius: scales(4),
  },
  btsTitle: {
    position: "absolute",
    bottom: scales(8),
    left: scales(8),
    right: scales(8),
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(10),
    lineHeight: scales(13),
  },
  reviewSheetContent: {
    paddingHorizontal: scales(16),
    paddingBottom: scales(30),
  },
  sheetHeaderScore: {
    alignItems: "center",
    paddingVertical: scales(10),
  },
  sheetBigScore: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(36),
  },
  sheetMaxScore: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(12),
  },
  sheetTotalRatings: {
    color: colors.blue,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(13),
    marginTop: scales(4),
  },
  reviewItem: {
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite10,
    borderRadius: scales(12),
    padding: scales(12),
    marginBottom: scales(10),
  },
  reviewHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scales(8),
  },
  reviewAvatar: {
    width: scales(32),
    height: scales(32),
    borderRadius: scales(16),
    marginRight: scales(10),
  },
  reviewHeaderMeta: {
    flex: 1,
  },
  reviewAuthor: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(13),
  },
  reviewDate: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(10),
  },
  reviewBadge: {
    backgroundColor: colors.transparentWhite10,
    paddingHorizontal: scales(8),
    paddingVertical: scales(4),
    borderRadius: scales(8),
  },
  reviewBadgeText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(11),
  },
  reviewComment: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.regular,
    fontSize: scales(12),
    lineHeight: scales(17),
  },
});
