import React, { useRef, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import { AppBackground, Spacer, CustomBottomSheet } from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages } from "../../assets";
import { navigate, goBack, routesConstants } from "../../navigation";
import LinearGradient from "react-native-linear-gradient";
import { styles } from "./styles";

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

  const posterSource = item?.images?.[0] ?? {
    uri: "https://picsum.photos/seed/movie_poster/800/1000",
  };
  const titleText = item?.title ?? "Dhanda Empire";
  const descriptionText = item?.description ?? commonText.dummyText;

  const handleProfilePress = useCallback(() => {
    navigate(routesConstants.Profile);
  }, []);

  return (
    <AppBackground isTopInset={false}>
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
              "rgba(0, 0, 0, 0.45)",
              colors.transparentBlack15,
              colors.transparentBlack25,
              colors.transparentBlack30,
            ]}
            locations={[0, 0.35, 0.7, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          <TouchableOpacity
            style={styles.floatingBackBtn}
            onPress={goBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Image
              source={appImages.backarrow}
              style={styles.backIcon}
              tintColor={colors.white}
            />
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
                  style={styles.miniPlayIcon}
                  tintColor={colors.white}
                />
              </LinearGradient>
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
                      style={styles.miniPlayIcon}
                      tintColor={colors.white}
                    />
                  </LinearGradient>
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
