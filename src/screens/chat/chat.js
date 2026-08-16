import React, { useState, memo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { AppBackground, Header, Spacer, CustomSearch } from "../../components";
import { colors, scales, commonText } from "../../utils";
import { fontFamily, appImages } from "../../assets";
import { navigate, routesConstants } from "../../navigation";
import Animated from "react-native-reanimated";
import { useTabBarScrollHandler } from "../../context/TabBarContext";
import LinearGradient from "react-native-linear-gradient";

const ChatItem = memo(({ item }) => (
  <TouchableOpacity
    style={styles.chatRow}
    activeOpacity={0.7}
    onPress={() => navigate(routesConstants.chatCard)}
  >
    <View style={styles.avatarWrapper}>
      <Image source={item.image || appImages.dummyuser} style={styles.avatar} />
      {item.online && <View style={styles.onlineBadge} />}
    </View>

    <View style={styles.chatDetails}>
      <Text style={styles.userName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text
        style={[styles.lastMessage, item.unread > 0 && styles.unreadMessage]}
        numberOfLines={1}
      >
        {item.message}
      </Text>
    </View>

    <View style={styles.chatMeta}>
      <Text style={[styles.timeText]}>{item.time}</Text>
      {item.unread > 0 ? (
        <LinearGradient
          colors={[colors.orange, colors.storyRing, colors.lightRed]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.unreadBadge,
            { width: item.unread > 9 ? scales(28) : scales(22) },
          ]}
        >
          <Text style={styles.unreadText}>{item.unread}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.metaPlaceholder} />
      )}
    </View>
  </TouchableOpacity>
));

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const Chat = () => {
  const [search, setSearch] = useState("");
  const scrollHandler = useTabBarScrollHandler();

  const chatData = [
    {
      id: "1",
      name: "Alex Johnson",
      message: "See you at the event! 🚀",
      time: "12:30 PM",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "Sarah Williams",
      message: "That's amazing news!",
      time: "10:15 AM",
      unread: 0,
      online: false,
    },
    {
      id: "3",
      name: "Dev Team",
      message: "Pushing to production...",
      time: "Yesterday",
      unread: 5,
      online: true,
    },
    {
      id: "4",
      name: "Marc Spencer",
      message: "Can we reschedule?",
      time: "Monday",
      unread: 0,
      online: false,
    },
    {
      id: "5",
      name: "Jessica Lee",
      message: "Sent an attachment.",
      time: "Last week",
      unread: 0,
      online: true,
    },
  ];

  const renderItem = useCallback(({ item }) => <ChatItem item={item} />, []);

  return (
    <AppBackground showAuthAnimation={true}>
      <Header
        label="Messages"
        showBackButton={false}
        rightIcon={appImages.plus}
        onRightPress={() => navigate(routesConstants.newChat)}
      />

      <CustomSearch
        placeholder={commonText.search}
        value={search}
        onChangeText={setSearch}
      />

      <Spacer height={scales(10)} />

      <AnimatedFlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: scales(20),
    marginTop: scales(10),
  },
  listContent: {
    paddingHorizontal: scales(20),
    paddingBottom: scales(30),
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scales(14),
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: scales(52),
    height: scales(52),
    borderRadius: scales(26),
    backgroundColor: colors.darkblack,
  },
  onlineBadge: {
    position: "absolute",
    bottom: scales(2),
    right: scales(2),
    width: scales(14),
    height: scales(14),
    borderRadius: scales(7),
    backgroundColor: colors.onlineGreen,
    borderWidth: 2,
    borderColor: colors.black,
  },
  chatDetails: {
    flex: 1,
    marginLeft: scales(14),
    marginRight: scales(10),
    justifyContent: "center",
  },
  userName: {
    fontSize: scales(16),
    fontFamily: fontFamily.bold,
    color: colors.white,
    marginBottom: scales(4),
  },
  lastMessage: {
    fontSize: scales(13),
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.6)",
  },
  unreadMessage: {
    color: colors.white,
    fontFamily: fontFamily.medium,
  },
  chatMeta: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: scales(6),
  },
  timeText: {
    fontSize: scales(12),
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.4)",
  },
  unreadTimeText: {
    color: colors.storyRing,
    fontFamily: fontFamily.medium,
  },
  unreadBadge: {
    height: scales(22),
    borderRadius: scales(11),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  unreadText: {
    color: colors.white,
    fontSize: scales(11),
    fontFamily: fontFamily.bold,
    textAlign: "center",
    includeFontPadding: false,
  },
  metaPlaceholder: {
    height: scales(22),
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: scales(2),
  },
});
