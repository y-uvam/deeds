import { View, Text, StyleSheet } from "react-native";
import { AppBackground, CustomSkeleton } from "../../components";
import { colors } from "../../utils";

export const Notification = () => {
  return (
    <AppBackground>
      <Text>Notification Screen</Text>
      <CustomSkeleton variant="listItem" />
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
  },
});
