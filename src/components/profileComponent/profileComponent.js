import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, scales } from "../../utils";
import { fontFamily } from "../../assets";
import { navigate, routesConstants } from "../../navigation";

export const ProfileComponent = ({ userId, name, profileImage }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigate(routesConstants.Profile);
        }}
      >
        <Image source={profileImage} style={styles.profileImage} />
      </TouchableOpacity>
      <Text style={styles.profileName}>{name}</Text>
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
});
