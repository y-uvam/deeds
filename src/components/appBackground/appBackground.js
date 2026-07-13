import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import { animations } from "../../animations/animations";
import { colors, topInset } from "../../utils";

export const AppBackground = ({ children, style, isTopInset = true, showAuthAnimation = false }) => {
  return (
    <View style={styles.container}>
      {showAuthAnimation && (
        <>
          <LottieView
            source={animations.background}
            autoPlay
            loop
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
        </>
      )}

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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 20, 36, 0.72)",
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
