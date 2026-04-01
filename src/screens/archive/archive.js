import { StyleSheet, Text } from "react-native";
import { AppBackground } from "../../components";
import { colors, scales } from "../../utils";

export const Archive = () => {
  return (
    <AppBackground>
      <Text style={styles.text}>Archive</Text>
    </AppBackground>
  );
};
const styles = StyleSheet.create({
  text: {
    color: colors.white,
    fontSize: scales(20),
  },
});
