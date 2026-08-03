import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, scales } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { navigate, routesConstants } from "../../navigation";

export const ProfileComponent = ({ userId, name, profileImage, image, style }) => {
  const avatarSource = profileImage || image || appImages.dummyuser;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigate(routesConstants.Profile);
        }}
      >
        <Image source={avatarSource} style={styles.profileImage} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.profileName} numberOfLines={1}>
          {name}
        </Text>
        {!!userId && (
          <Text style={styles.profileUsername} numberOfLines={1}>
            @{userId}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scales(10),
    flexDirection: "row",
    alignItems: "center",
    gap: scales(10),
  },
  profileImage: {
    width: scales(40),
    height: scales(40),
    borderRadius: scales(20),
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontFamily: fontFamily.regular,
    color: colors.white,
    fontSize: scales(16),
  },
  profileUsername: {
    fontFamily: fontFamily.regular,
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: scales(14),
    marginTop: scales(2),
  },
});

