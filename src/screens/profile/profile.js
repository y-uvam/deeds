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
} from "react-native";
import { Spacer, CustomSkeleton, AppBackground } from "../../components";
import { colors, scales, commonText } from "../../utils";
import { useSelector } from "react-redux";
import { fontFamily, appImages } from "../../assets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { navigate, routesConstants } from "../../navigation";

const { width } = Dimensions.get("window");

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
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState(0);
  const tabAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabPress = (index) => {
    setActiveTab(index);
    Animated.spring(tabAnim, {
      toValue: index,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  };

  const getGridData = () => {
    if (activeTab === 0) return POSTS;
    if (activeTab === 1) return REELS;
    return TAGS;
  };

  const renderCoverPhoto = () => {
    const translateY = scrollY.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: [-50, 0, 0],
      extrapolate: "clamp",
    });
    const scale = scrollY.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: [1.5, 1, 1],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[
          styles.coverContainer,
          { transform: [{ translateY }, { scale }] },
        ]}
      >
        <Image source={appImages.appBackground} style={styles.coverImage} />
        <View style={styles.coverOverlay} />
        <View style={[styles.headerActions, { top: insets.top + scales(10) }]}>
          <TouchableOpacity style={styles.iconCircle}>
            <Image source={appImages.backarrow} style={styles.backIcon} />
          </TouchableOpacity>
          <View style={styles.rightHeaderActions}>
            <TouchableOpacity style={styles.iconCircle}>
              <Image source={appImages.plus} style={styles.topIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle}>
              <Image source={appImages.settings} style={styles.topIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
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
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            navigate(routesConstants.editProfile);
          }}
        >
          <Text style={styles.editBtnText}>{commonText.editProfile}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn}>
          <Image
            source={appImages.share}
            style={styles.shareIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
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
        <View style={styles.statBox}>
          <Text style={styles.statBoxValue}>125K</Text>
          <Text style={styles.statBoxLabel}>{commonText.followers}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statBoxValue}>450</Text>
          <Text style={styles.statBoxLabel}>{commonText.following}</Text>
        </View>
      </View>
    </View>
  );

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
    const tabTranslate = tabAnim.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [
        0,
        (width - scales(32)) / 3,
        ((width - scales(32)) / 3) * 2,
      ],
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
            source={appImages.play}
            style={[
              styles.tabIconNew,
              activeTab === 1 && styles.tabIconNewActive,
            ]}
          />
          <Text
            style={[styles.tabText, activeTab === 1 && styles.tabTextActive]}
          >
            {commonText.reels}
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

  const renderGridItem = ({ item }) => (
    <TouchableOpacity style={styles.modernGridItem}>
      <Image source={item.image} style={styles.modernGridImage} />
    </TouchableOpacity>
  );

  const listHeader = (
    <View>
      {renderCoverPhoto()}
      {renderProfileCard()}
      <Spacer height={scales(20)} />
      {renderHighlights()}
      <Spacer height={scales(20)} />
      {renderTabs()}
      <Spacer height={scales(10)} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomSkeleton variant="profile" loading={loading} />
      </View>
    );
  }

  return (
    <AppBackground>
      <FlatList
        data={getGridData()}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={renderGridItem}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        initialNumToRender={15}
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      />
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
    height: scales(220),
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightHeaderActions: {
    flexDirection: "row",
  },
  iconCircle: {
    width: scales(40),
    height: scales(40),
    borderRadius: scales(20),
    backgroundColor: "rgba(255,255,255,0.2)",
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
    backgroundColor: colors.profileCardBg,
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
    borderRadius: scales(35),
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
    backgroundColor: colors.profileStatsBg,
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
    backgroundColor: colors.profileTabsBg,
    borderRadius: scales(30),
    padding: scales(4),
    position: "relative",
  },
  activeTabBg: {
    position: "absolute",
    top: scales(4),
    bottom: scales(4),
    left: scales(4),
    width: (width - scales(32)) / 3 - scales(8),
    backgroundColor: colors.profileDivider,
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
});
