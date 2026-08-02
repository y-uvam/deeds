import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { AppBackground, Header, ProfileComponent } from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { showCustomMessage } from "../../helper/FlashMessage";

export const Blocked = () => {
  const [blockedUsers, setBlockedUsers] = useState([
    { id: "1", name: "John Doe", username: "johndoe", avatar: appImages.dummyuser },
    { id: "2", name: "Jane Smith", username: "janesmith", avatar: appImages.dummyuser },
    { id: "3", name: "Alex Johnson", username: "alex_j", avatar: appImages.dummyuser },
  ]);

  const handleUnblock = (user) => {
    setBlockedUsers((prev) => prev.filter((item) => item.id !== user.id));
    showCustomMessage(`Unblocked @${user.username}`, "success");
  };

  const renderItem = ({ item }) => (
    <View style={styles.userRow}>
      <View style={{ flex: 1, marginRight: scales(12) }}>
        <ProfileComponent
          name={item.name}
          userId={item.username}
          image={item.avatar}
        />
      </View>
      <TouchableOpacity style={styles.unblockButton} onPress={() => handleUnblock(item)}>
        <Text style={styles.unblockText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <AppBackground>
      <Header label={commonText.blocked} showBackButton={true} />
      {blockedUsers.length > 0 ? (
        <FlatList
          data={blockedUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image source={appImages.blocked} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>No blocked accounts</Text>
        </View>
      )}
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: scales(16),
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
  unblockButton: {
    backgroundColor: colors.white,
    paddingHorizontal: scales(16),
    paddingVertical: scales(8),
    borderRadius: scales(20),
  },
  unblockText: {
    fontFamily: fontFamily.bold,
    color: colors.black,
    fontSize: scales(14),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: scales(80),
  },
  emptyIcon: {
    width: scales(60),
    height: scales(60),
    tintColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: scales(16),
  },
  emptyText: {
    fontFamily: fontFamily.medium,
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: scales(16),
  },
});
