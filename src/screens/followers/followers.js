import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import {
  AppBackground,
  Header,
  CustomSearch,
  ProfileComponent,
} from "../../components";
import { colors, scales } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { showCustomMessage } from "../../helper/FlashMessage";

const { width } = Dimensions.get("window");

const DUMMY_FOLLOWERS = [
  {
    id: "1",
    name: "Alice Cooper",
    username: "alice_c",
    avatar: appImages.dummyuser,
    isFollowing: true,
  },
  {
    id: "2",
    name: "Bob Marley",
    username: "bob_m",
    avatar: appImages.dummyuser,
    isFollowing: false,
  },
  {
    id: "3",
    name: "Charlie Puth",
    username: "charlie_p",
    avatar: appImages.dummyuser,
    isFollowing: true,
  },
  {
    id: "4",
    name: "Diana Prince",
    username: "wonder_diana",
    avatar: appImages.dummyuser,
    isFollowing: false,
  },
  {
    id: "5",
    name: "Ethan Hunt",
    username: "ethan_h",
    avatar: appImages.dummyuser,
    isFollowing: true,
  },
];

const DUMMY_FOLLOWING = [
  {
    id: "1",
    name: "Alice Cooper",
    username: "alice_c",
    avatar: appImages.dummyuser,
    isFollowing: true,
  },
  {
    id: "3",
    name: "Charlie Puth",
    username: "charlie_p",
    avatar: appImages.dummyuser,
    isFollowing: true,
  },
  {
    id: "5",
    name: "Ethan Hunt",
    username: "ethan_h",
    avatar: appImages.dummyuser,
    isFollowing: true,
  },
  {
    id: "6",
    name: "Fiona Gallagher",
    username: "fiona_g",
    avatar: appImages.dummyuser,
    isFollowing: true,
  },
  {
    id: "7",
    name: "George Clooney",
    username: "george_c",
    avatar: appImages.dummyuser,
    isFollowing: true,
  },
];

export const Followers = ({ route }) => {
  const { type = "followers" } = route?.params || {};
  const [activeTab, setActiveTab] = useState(type);
  const [searchText, setSearchText] = useState("");
  const [followers, setFollowers] = useState(DUMMY_FOLLOWERS);
  const [following, setFollowing] = useState(DUMMY_FOLLOWING);

  const scrollViewRef = useRef(null);
  const scrollX = useRef(
    new Animated.Value(type === "following" ? width : 0),
  ).current;

  useEffect(() => {
    if (type) {
      setActiveTab(type);
    }
  }, [type]);

  // Handle programmatically scrolling when activeTab is selected via header click
  useEffect(() => {
    if (activeTab === "followers") {
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    } else {
      scrollViewRef.current?.scrollTo({ x: width, animated: true });
    }
  }, [activeTab]);

  const handleRemoveFollower = (user) => {
    setFollowers((prev) => prev.filter((item) => item.id !== user.id));
    showCustomMessage(`Removed @${user.username} from followers`, "success");
  };

  const handleToggleFollow = (user) => {
    setFollowing((prev) =>
      prev.map((item) =>
        item.id === user.id
          ? { ...item, isFollowing: !item.isFollowing }
          : item,
      ),
    );
    showCustomMessage(
      user.isFollowing
        ? `Unfollowed @${user.username}`
        : `Followed @${user.username}`,
      "success",
    );
  };

  const handleMomentumScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    const newTab = index === 0 ? "followers" : "following";
    if (newTab !== activeTab) {
      setActiveTab(newTab);
      setSearchText("");
    }
  };

  const filteredFollowers = followers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase()),
  );

  const filteredFollowing = following.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderItem = ({ item }) => (
    <View style={styles.userRow}>
      <ProfileComponent
        name={item.name}
        userId={item.username}
        profileImage={
          typeof item.avatar === "string"
            ? { uri: item.avatar }
            : item.avatar || appImages.dummyuser
        }
        style={{ flex: 1, paddingHorizontal: 0 }}
      />

      {activeTab === "followers" ? (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFollower(item)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.followButton,
            item.isFollowing ? styles.followingButtonBg : styles.followButtonBg,
          ]}
          onPress={() => handleToggleFollow(item)}
        >
          <Text
            style={[
              styles.followButtonText,
              item.isFollowing
                ? styles.followingButtonText
                : styles.followButtonText,
            ]}
          >
            {item.isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Interpolate translateX of the tab underline indicator
  const translateX = scrollX.interpolate({
    inputRange: [0, width],
    outputRange: [0, width / 2],
    extrapolate: "clamp",
  });

  return (
    <AppBackground>
      <Header
        label={activeTab === "following" ? "Following" : "Followers"}
        showBackButton={true}
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => {
            setActiveTab("followers");
            setSearchText("");
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "followers" && styles.activeTabText,
            ]}
          >
            {followers.length} Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => {
            setActiveTab("following");
            setSearchText("");
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "following" && styles.activeTabText,
            ]}
          >
            {following.length} Following
          </Text>
        </TouchableOpacity>

        {/* Animated active indicator line */}
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>

      <CustomSearch
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search"
      />

      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentOffset={{ x: type === "following" ? width : 0, y: 0 }}
        style={styles.horizontalScroll}
      >
        <View style={{ width }}>
          {filteredFollowers.length > 0 ? (
            <FlatList
              data={filteredFollowers}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No followers found</Text>
            </View>
          )}
        </View>

        <View style={{ width }}>
          {filteredFollowing.length > 0 ? (
            <FlatList
              data={filteredFollowing}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No following users found</Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: scales(10),
    position: "relative",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: scales(14),
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "50%",
    height: 2,
    backgroundColor: colors.white,
  },
  tabText: {
    fontFamily: fontFamily.medium,
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: scales(15),
  },
  activeTabText: {
    fontFamily: fontFamily.bold,
    color: colors.white,
  },
  horizontalScroll: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: scales(16),
    paddingBottom: scales(20),
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.transparentWhite5,
    borderRadius: scales(16),
    padding: scales(12),
    marginBottom: scales(12),
  },
  removeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: scales(16),
    paddingVertical: scales(8),
    borderRadius: scales(20),
  },
  removeButtonText: {
    fontFamily: fontFamily.bold,
    color: colors.white,
    fontSize: scales(14),
  },
  followButton: {
    paddingHorizontal: scales(16),
    paddingVertical: scales(8),
    borderRadius: scales(20),
  },
  followButtonBg: {
    backgroundColor: colors.blue,
  },
  followingButtonBg: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  followButtonText: {
    fontFamily: fontFamily.bold,
    color: colors.white,
    fontSize: scales(14),
  },
  followingButtonText: {
    fontFamily: fontFamily.bold,
    color: colors.white,
    fontSize: scales(14),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: scales(80),
  },
  emptyText: {
    fontFamily: fontFamily.medium,
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: scales(16),
  },
});
