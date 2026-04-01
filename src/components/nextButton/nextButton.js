import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { appImages, fontFamily } from "../../assets";
import { colors, scales } from "../../utils";

export const NextButton = ({ leftIcon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftContainer}>
        <Image source={leftIcon} style={styles.leftIcon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Image style={styles.next} source={appImages.backarrow} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scales(10),
    marginVertical: scales(5),
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(10),
  },
  leftIcon: {
    height: 25,
    width: 25,
    tintColor: colors.white,
  },
  label: {
    fontFamily: fontFamily.regular,
    color: colors.white,
    fontSize: scales(16),
  },
  next: {
    height: 15,
    width: 15,
    tintColor: colors.white,
    transform: [{ rotate: "180deg" }],
  },
});
