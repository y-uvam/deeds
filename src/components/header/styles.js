import { StyleSheet } from "react-native";
import { colors, scales } from "../../utils";
import { fontFamily } from "../../assets";

export const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  container: {
    paddingHorizontal: scales(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: scales(52),
    width: "100%",
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: scales(12),
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: scales(10),
  },
  roundButtonWrapper: {
    height: scales(40),
    width: scales(40),
    borderRadius: scales(20),
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.12)",
    borderWidth: StyleSheet.hairlineWidth,
  },
  gradientBtnWrapper: {
    height: scales(40),
    width: scales(40),
    borderRadius: scales(20),
    overflow: "hidden",
    elevation: 4,
    shadowColor: colors.storyRing,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  gradientBtnCircle: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    height: scales(18),
    width: scales(18),
    resizeMode: "contain",
  },
  brandWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: fontFamily.bold,
    color: colors.white,
    fontSize: scales(18),
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  bottomLine: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginTop: scales(4),
  },
});
