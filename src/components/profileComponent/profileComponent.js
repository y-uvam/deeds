import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, scales } from "../../utils";
import { fontFamily } from "../../assets";
import { navigate, routesConstants } from "../../navigation";

export const ProfileComponent = ({ userId, name, profileImage, style }) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => {
          navigate(routesConstants.Profile);
        }}
      >
        <Image source={profileImage} style={styles.profileImage} />
      </TouchableOpacity>
      <View>
        <Text style={styles.profileName}>{name}</Text>
        {!!userId && <Text style={styles.profileUsername}>@{userId}</Text>}
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
    gap: 10,
  },
  profileImage: {
    width: scales(40),
    height: scales(40),
    borderRadius: scales(25),
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
