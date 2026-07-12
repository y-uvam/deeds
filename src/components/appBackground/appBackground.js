import { StyleSheet, View } from "react-native";
import { colors, topInset } from "../../utils";

export const AppBackground = ({ children, style, isTopInset = true }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topAccent} />

      <View
        style={[
          styles.content,
          { paddingTop: isTopInset ? topInset : 0, ...style },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(0,136,255,0.25)",
  },
  content: {
    flex: 1,
  },
});
