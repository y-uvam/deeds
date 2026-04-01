import React, { memo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { AppBackground, Header, Spacer, CustomInput } from "../../components";
import { colors, scales } from "../../utils";
import { appImages, fontFamily } from "../../assets";

const ChatItem = memo(({ item }) => (
  <TouchableOpacity style={styles.chatRow} activeOpacity={0.7}>
    <View style={styles.avatarWrapper}>
      <Image source={item.image || appImages.dummyuser} style={styles.avatar} />
      {item.online && <View style={styles.onlineBadge} />}
    </View>
    <View style={styles.chatDetails}>
      <View style={styles.chatHeader}>
        <Text style={styles.userName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <View style={styles.chatFooter}>
        <Text style={[styles.lastMessage, item.unread && styles.unreadMessage]} numberOfLines={1}>
          {item.message}
        </Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
));

export const Chat = () => {
  const [search, setSearch] = useState("");

  const chatData = [
    { id: "1", name: "Alex Johnson", message: "See you at the event! 🚀", time: "12:30 PM", unread: 2, online: true },
    { id: "2", name: "Sarah Williams", message: "That's amazing news!", time: "10:15 AM", unread: 0, online: false },
    { id: "3", name: "Dev Team", message: "Pushing to production...", time: "Yesterday", unread: 5, online: true },
    { id: "4", name: "Marc Spencer", message: "Can we reschedule?", time: "Monday", unread: 0, online: false },
    { id: "5", name: "Jessica Lee", message: "Sent an attachment.", time: "Last week", unread: 0, online: true },
  ];

  const renderItem = useCallback(({ item }) => <ChatItem item={item} />, []);

  return (
    <AppBackground>
      <Header label="Messages" showBackButton={false} rightIcon={appImages.plus} />
      
      <View style={styles.searchContainer}>
        <CustomInput
          placeholder="Search conversations..."
          value={search}
          onChangeText={setSearch}
          leftIcon={appImages.browse}
          height={scales(50)}
        />
      </View>

      <Spacer height={scales(10)} />

      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingVertical: scales(15),
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: scales(55),
    height: scales(55),
    borderRadius: scales(27.5),
    backgroundColor: colors.darkblack,
  },
  onlineBadge: {
    position: "absolute",
    bottom: scales(2),
    right: scales(2),
    width: scales(14),
    height: scales(14),
    borderRadius: scales(7),
    backgroundColor: "#00D15D",
    borderWidth: 2,
    borderColor: colors.black,
  },
  chatDetails: {
    flex: 1,
    marginLeft: scales(15),
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scales(4),
  },
  userName: {
    fontSize: scales(16),
    fontFamily: fontFamily.bold,
    color: colors.white,
    flex: 1,
  },
  timeText: {
    fontSize: scales(12),
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.4)",
    marginLeft: scales(10),
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: scales(14),
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.6)",
    flex: 1,
  },
  unreadMessage: {
    color: colors.white,
    fontFamily: fontFamily.medium,
  },
  unreadBadge: {
    backgroundColor: colors.blue,
    minWidth: scales(20),
    height: scales(20),
    borderRadius: scales(10),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scales(6),
    marginLeft: scales(10),
  },
  unreadText: {
    color: colors.white,
    fontSize: scales(10),
    fontFamily: fontFamily.bold,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: scales(2),
  },
});
