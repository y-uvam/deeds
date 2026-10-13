import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
} from "react-native";
import {
  Spacer,
  CustomSkeleton,
  AppBackground,
  CustomButton,
} from "../../components";
import { colors, scales, commonText } from "../../utils";
import { useSelector } from "react-redux";
import { fontFamily, appImages } from "../../assets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { navigate, routesConstants } from "../../navigation";
import AnimatedRN from "react-native-reanimated";
import { useTabBarScrollHandler } from "../../context/TabBarContext";
import Share from "react-native-share";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");
const AnimatedRNScrollView = AnimatedRN.createAnimatedComponent(ScrollView);

const POSTS = Array.from({ length: 5 }, (_, i) => ({
  id: `post_${i}`,
  image: appImages.post,
}));

const REELS = Array.from({ length: 8 }, (_, i) => ({
  id: `reel_${i}`,
  image: appImages.post,
}));

const TAGS = Array.from({ length: 4 }, (_, i) => ({
  id: `tag_${i}`,
  image: appImages.post,
}));

const HIGHLIGHTS = [
  { id: "highlight_1", title: "Travel", image: appImages.dummyuser },
  { id: "highlight_2", title: "Work", image: appImages.dummyuser },
  { id: "highlight_3", title: "Music", image: appImages.dummyuser },
  { id: "highlight_4", title: "Sports", image: appImages.dummyuser },
  { id: "highlight_5", title: "Life", image: appImages.dummyuser },
];

export const Profile = () => {
  const insets = useSafeAreaInsets();
  const profileData = useSelector((state) => state.persist.profileData);
  const [activeTab, setActiveTab] = useState(0);

  const handleShare = () => {
    const username = profileData?.username || commonText.profileHandle;
    Share.open({
      title: "Share Profile",
      message: `Check out @${username} on Sinema!`,
      url: `https://sinema.app/profile/${username}`,
    }).catch((err) => {
      err && console.log(err);
    });
  };
  const horizontalScrollRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const scrollHandler = useTabBarScrollHandler();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabPress = (index) => {
    setActiveTab(index);
    horizontalScrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleMomentumScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    if (index !== activeTab) {
      setActiveTab(index);
    }
  };

  const renderCoverPhoto = () => {
    return (
      <View
        style={[styles.coverContainer, { height: scales(150) + insets.top }]}
      >
        <Image
          source={appImages.poster1 || { uri: "https://picsum.photos/" }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <View style={styles.coverOverlay} />
        <View style={[styles.headerActions, { top: insets.top + scales(10) }]}>
          <View style={styles.rightHeaderActions}>
            <TouchableOpacity style={styles.iconCircle} onPress={handleShare}>
              <Image
                source={appImages.share}
                style={styles.shareIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => {
                navigate(routesConstants.editProfile);
              }}
            >
              <Image
                source={appImages.edit}
                style={styles.topIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => {
                navigate(routesConstants.Settings);
              }}
            >
              <Image source={appImages.settings} style={styles.topIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderProfileCard = () => (
    <View style={styles.profileCard}>
      <View style={styles.avatarRow}>
        <View style={styles.avatarWrapper}>
          <Image
            source={profileData?.profileImage || appImages.dummyuser}
            style={styles.avatarImage}
          />
        </View>
      </View>

      <Text style={styles.profileName}>
        {profileData?.name || commonText.profileName}
      </Text>
      <Text style={styles.profileHandle}>
        @{profileData?.username || commonText.profileHandle}
      </Text>

      <Text style={styles.profileBio}>{commonText.profileBio}</Text>

      <TouchableOpacity style={styles.linkPill}>
        <Text style={styles.linkText}>{commonText.profileLink}</Text>
      </TouchableOpacity>

      <View style={styles.statsCardRow}>
        <View style={styles.statBox}>
          <Text style={styles.statBoxValue}>1.2K</Text>
          <Text style={styles.statBoxLabel}>{commonText.posts}</Text>
        </View>
        <View style={styles.statDivider} />
        <TouchableOpacity
          style={styles.statBox}
          onPress={() =>
            navigate(routesConstants.followers, { type: "followers" })
          }
          activeOpacity={0.7}
        >
          <Text style={styles.statBoxValue}>125K</Text>
          <Text style={styles.statBoxLabel}>{commonText.followers}</Text>
        </TouchableOpacity>
        <View style={styles.statDivider} />
        <TouchableOpacity
          style={styles.statBox}
          onPress={() =>
            navigate(routesConstants.followers, { type: "following" })
          }
          activeOpacity={0.7}
        >
          <Text style={styles.statBoxValue}>450</Text>
          <Text style={styles.statBoxLabel}>{commonText.following}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProfileCompletion = () => {
    const setupSteps = [
      {
        id: "step_name",
        title: "Name & Handle",
        icon: appImages.check || appImages.dummyuser,
        buttonText: "Done",
        completed: true,
        action: null,
      },
      {
        id: "step_bio",
        title: "Add Bio",
        icon: appImages.edit || appImages.post,
        buttonText: "Add",
        completed: !!(profileData?.bio && profileData?.bio.trim() !== ""),
        action: () => navigate(routesConstants.editProfile),
      },
      {
        id: "step_photo",
        title: "Cover Banner",
        icon: appImages.gallery || appImages.dummyuser,
        buttonText: "Upload",
        completed: false,
        action: () => navigate(routesConstants.editProfile),
      },
      {
        id: "step_post",
        title: "First Bite",
        icon: appImages.reels || appImages.reels,
        buttonText: "Create",
        completed: false,
        action: () => navigate(routesConstants.selectMedia || "SelectMedia"),
      },
    ];

    const totalSteps = setupSteps.length;
    const completedSteps = setupSteps.filter((s) => s.completed).length;
    const progressPercent = Math.round((completedSteps / totalSteps) * 100);

    return (
      <View style={styles.minimalCompletionSection}>
        {/* Compact Summary Header */}
        <View style={styles.minimalHeaderRow}>
          <View style={styles.minimalHeaderLeft}>
            <View style={styles.progressDot} />
            <Text style={styles.minimalHeaderText}>
              {commonText.profileSetup}{" "}
              <Text style={styles.minimalPercentText}>
                • {progressPercent}%
              </Text>
            </Text>
          </View>
          <View style={styles.miniProgressTrack}>
            <LinearGradient
              colors={[colors.orange, colors.storyRing, colors.lightRed]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.miniProgressFill,
                { width: `${progressPercent}%` },
              ]}
            />
          </View>
        </View>

        {/* Minimal Capsule Carousel */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={setupSteps}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.minimalCarouselContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={item.completed ? 1 : 0.8}
              onPress={item.action ? item.action : null}
              style={[
                styles.minimalPillCard,
                item.completed && styles.minimalPillCardDone,
              ]}
            >
              <View
                style={[
                  styles.minimalIconRing,
                  item.completed && styles.minimalIconRingDone,
                ]}
              >
                <Image
                  source={item.completed ? appImages.check : item.icon}
                  style={[
                    styles.minimalIcon,
                    item.completed
                      ? {
                          tintColor: colors.lightGreen,
                          width: scales(14),
                          height: scales(14),
                        }
                      : { tintColor: colors.white },
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.minimalPillTitle,
                  item.completed && styles.minimalPillTitleDone,
                ]}
                numberOfLines={1}
              >
                {item.title}
              </Text>

              <View style={styles.minimalActionWrapper}>
                {item.completed ? (
                  <Text style={styles.minimalDoneText}>{commonText.done}</Text>
                ) : (
                  <CustomButton
                    label={item.buttonText}
                    onPress={item.action}
                    buttonWidth={scales(66)}
                    buttonStyle={styles.minimalBtn}
                    labelStyle={styles.minimalBtnText}
                  />
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  const renderHighlights = () => (
    <View style={styles.highlightsSection}>
      <Text style={styles.sectionTitle}>{commonText.achievementVault}</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={HIGHLIGHTS}
        keyExtractor={(item) => item.id}
        style={{ minHeight: scales(110) }}
        contentContainerStyle={styles.highlightsContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.uniqueHighlight}>
            <Image source={item.image} style={styles.uniqueHighlightImg} />
            <View style={styles.uniqueHighlightOverlay}>
              <Text style={styles.uniqueHighlightText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderTabs = () => {
    const tabTranslate = scrollX.interpolate({
      inputRange: [0, width, width * 2],
      outputRange: [
        0,
        (width - scales(32)) / 3,
        ((width - scales(32)) / 3) * 2,
      ],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.tabsWrapper}>
        <Animated.View
          style={[
            styles.activeTabBg,
            { transform: [{ translateX: tabTranslate }] },
          ]}
        />
        <TouchableOpacity
          style={styles.tabPress}
          onPress={() => handleTabPress(0)}
        >
          <Image
            source={appImages.posts}
            style={[
              styles.tabIconNew,
              activeTab === 0 && styles.tabIconNewActive,
            ]}
          />
          <Text
            style={[styles.tabText, activeTab === 0 && styles.tabTextActive]}
          >
            {commonText.posts}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabPress}
          onPress={() => handleTabPress(1)}
        >
          <Image
            source={appImages.reels}
            style={[
              styles.tabIconNew,
              activeTab === 1 && styles.tabIconNewActive,
            ]}
          />
          <Text
            style={[styles.tabText, activeTab === 1 && styles.tabTextActive]}
          >
            {commonText.bites}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabPress}
          onPress={() => handleTabPress(2)}
        >
          <Image
            source={appImages.tag}
            style={[
              styles.tabIconNew,
              activeTab === 2 && styles.tabIconNewActive,
            ]}
          />
          <Text
            style={[styles.tabText, activeTab === 2 && styles.tabTextActive]}
          >
            {commonText.tags}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderGrid = (items, emptyText) => (
    <View style={styles.gridContainer}>
      {items.length > 0 ? (
        items.map((item) => (
          <TouchableOpacity key={item.id} style={styles.modernGridItem}>
            <Image
              source={item.image}
              style={styles.modernGridImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      )}
    </View>
  );

  const renderContentPager = () => (
    <Animated.ScrollView
      ref={horizontalScrollRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true },
      )}
      onMomentumScrollEnd={handleMomentumScrollEnd}
    >
      <View style={{ width }}>{renderGrid(POSTS, "No posts yet")}</View>
      <View style={{ width }}>{renderGrid(REELS, "No bites yet")}</View>
      <View style={{ width }}>{renderGrid(TAGS, "No tagged posts yet")}</View>
    </Animated.ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomSkeleton variant="profile" loading={loading} />
      </View>
    );
  }

  return (
    <AppBackground isTopInset={false} showAuthAnimation={true}>
      <AnimatedRNScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {renderCoverPhoto()}
        {renderProfileCard()}
        <Spacer height={scales(20)} />
        {renderProfileCompletion()}
        <Spacer height={scales(10)} />
        {renderHighlights()}
        <Spacer height={scales(20)} />
        {renderTabs()}
        {renderContentPager()}
      </AnimatedRNScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  coverContainer: {
    width: "100%",
    height: scales(150),
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  headerActions: {
    position: "absolute",
    left: scales(16),
    right: scales(16),
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  rightHeaderActions: {
    flexDirection: "row",
  },
  iconCircle: {
    width: scales(40),
    height: scales(40),
    borderRadius: scales(20),
    backgroundColor: colors.transparentWhite5,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scales(10),
  },
  backIcon: {
    width: scales(18),
    height: scales(18),
    tintColor: colors.white,
  },
  topIcon: {
    width: scales(20),
    height: scales(20),
    tintColor: colors.white,
  },
  profileCard: {
    // backgroundColor: colors.profileCardBg,
    borderTopLeftRadius: scales(30),
    borderTopRightRadius: scales(30),
    paddingHorizontal: scales(20),
    paddingTop: scales(20),
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: scales(-50),
  },
  avatarWrapper: {
    width: scales(100),
    height: scales(100),
    borderRadius: scales(50),
    backgroundColor: colors.profileCardBg,
    padding: scales(4),
    marginRight: "auto",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: scales(31),
  },
  editBtn: {
    backgroundColor: colors.profileBtnBg,
    paddingVertical: scales(10),
    paddingHorizontal: scales(20),
    borderRadius: scales(25),
    marginRight: scales(10),
  },
  editBtnText: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(14),
  },
  shareBtn: {
    backgroundColor: colors.profileBtnBg,
    width: scales(40),
    height: scales(40),
    borderRadius: scales(20),
    justifyContent: "center",
    alignItems: "center",
  },
  shareIcon: {
    width: scales(18),
    height: scales(18),
    tintColor: colors.white,
  },
  profileName: {
    color: colors.white,
    fontSize: scales(24),
    fontFamily: fontFamily.bold,
  },
  profileHandle: {
    color: colors.profileHandleText,
    fontSize: scales(14),
    fontFamily: fontFamily.medium,
    marginBottom: scales(15),
  },
  profileBio: {
    color: colors.profileBioText,
    fontSize: scales(14),
    fontFamily: fontFamily.regular,
    lineHeight: scales(20),
    marginBottom: scales(15),
  },
  linkPill: {
    backgroundColor: "rgba(0, 136, 255, 0.1)",
    alignSelf: "flex-start",
    paddingVertical: scales(6),
    paddingHorizontal: scales(12),
    borderRadius: scales(20),
    marginBottom: scales(20),
  },
  linkText: {
    color: colors.blue,
    fontSize: scales(13),
    fontFamily: fontFamily.medium,
  },
  statsCardRow: {
    flexDirection: "row",
    backgroundColor: colors.transparentWhite5,
    borderRadius: scales(20),
    paddingVertical: scales(15),
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  statBox: {
    alignItems: "center",
  },
  statBoxValue: {
    color: colors.white,
    fontSize: scales(18),
    fontFamily: fontFamily.bold,
  },
  statBoxLabel: {
    color: colors.profileHandleText,
    fontSize: scales(12),
    fontFamily: fontFamily.medium,
  },
  statDivider: {
    width: 1,
    height: scales(30),
    backgroundColor: colors.profileDivider,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: scales(18),
    fontFamily: fontFamily.bold,
    paddingHorizontal: scales(20),
    marginBottom: scales(15),
  },
  highlightsSection: {},
  highlightsContainer: {
    paddingHorizontal: scales(20),
  },
  uniqueHighlight: {
    width: scales(65),
    height: scales(65),
    borderRadius: scales(33),
    marginRight: scales(12),
  },
  uniqueHighlightImg: {
    width: "100%",
    height: "100%",
  },
  uniqueHighlightOverlay: {
    justifyContent: "flex-end",
    padding: scales(10),
    alignItems: "center",
  },
  uniqueHighlightText: {
    color: colors.white,
    fontSize: scales(12),
    fontFamily: fontFamily.semiBold,
  },
  tabsWrapper: {
    flexDirection: "row",
    marginHorizontal: scales(16),
    backgroundColor: colors.transparentWhite5,
    borderRadius: scales(30),
    padding: scales(4),
    position: "relative",
    marginBottom: scales(10),
  },
  activeTabBg: {
    position: "absolute",
    top: scales(4),
    bottom: scales(4),
    left: scales(4),
    width: (width - scales(32)) / 3 - scales(8),
    backgroundColor: colors.transparentWhite10,
    borderRadius: scales(25),
  },
  tabPress: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scales(12),
  },
  tabIconNew: {
    width: scales(18),
    height: scales(18),
    tintColor: colors.profileHandleText,
    marginRight: scales(6),
  },
  tabIconNewActive: {
    tintColor: colors.white,
  },
  tabText: {
    color: colors.profileHandleText,
    fontSize: scales(14),
    fontFamily: fontFamily.semiBold,
  },
  tabTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingBottom: scales(100),
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: width,
  },
  modernGridItem: {
    width: width / 3 - 2,
    height: width / 3 + scales(30),
    marginHorizontal: 1,
    marginBottom: 2,
    borderRadius: scales(8),
    overflow: "hidden",
  },
  modernGridImage: {
    width: "100%",
    height: "100%",
  },
  emptyContainer: {
    paddingVertical: scales(40),
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: fontFamily.medium,
    fontSize: scales(14),
  },
  minimalCompletionSection: {
    marginBottom: scales(4),
  },
  minimalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scales(16),
    marginBottom: scales(10),
  },
  minimalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(8),
  },
  progressDot: {
    width: scales(8),
    height: scales(8),
    borderRadius: scales(4),
    backgroundColor: colors.storyRing,
  },
  minimalHeaderText: {
    fontFamily: fontFamily.medium,
    fontSize: scales(13),
    color: "rgba(255, 255, 255, 0.7)",
  },
  minimalPercentText: {
    fontFamily: fontFamily.bold,
    color: colors.white,
  },
  miniProgressTrack: {
    width: scales(70),
    height: scales(5),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: scales(2.5),
    overflow: "hidden",
  },
  miniProgressFill: {
    height: "100%",
    borderRadius: scales(2.5),
  },
  minimalCarouselContainer: {
    paddingHorizontal: scales(16),
  },
  minimalPillCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.transparentWhite5,
    height: scales(52),
    borderRadius: scales(26),
    paddingLeft: scales(8),
    paddingRight: scales(10),
    marginRight: scales(10),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  minimalPillCardDone: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  minimalIconRing: {
    width: scales(36),
    height: scales(36),
    borderRadius: scales(18),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scales(10),
  },
  minimalIconRingDone: {
    backgroundColor: "rgba(0, 200, 150, 0.12)",
  },
  minimalIcon: {
    width: scales(16),
    height: scales(16),
    resizeMode: "contain",
  },
  minimalPillTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: scales(14),
    color: colors.white,
    marginRight: scales(12),
  },
  minimalPillTitleDone: {
    fontFamily: fontFamily.medium,
    color: "rgba(255, 255, 255, 0.5)",
  },
  minimalActionWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  minimalDoneText: {
    fontFamily: fontFamily.semiBold,
    fontSize: scales(12),
    color: colors.lightGreen,
    paddingHorizontal: scales(6),
  },
  minimalBtn: {
    height: scales(34),
    borderRadius: scales(17),
    alignItems: "center",
    justifyContent: "center",
  },
  minimalBtnText: {
    fontSize: scales(12),
    fontFamily: fontFamily.semiBold,
  },
});
