import { StyleSheet } from "react-native";
import { colors, scales } from "../../utils";
import { fontFamily } from "../../assets";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: scales(32),
    justifyContent: "center",
  },
  iconWrapper: {
    width: scales(130),
    height: scales(130),
    justifyContent: "center",
    alignItems: "center",
  },
  lottieIcon: {
    width: scales(130),
    height: scales(130),
  },
  uploadIcon: {
    width: scales(32),
    height: scales(32),
    resizeMode: "contain",
  },
  doneIcon: {
    width: scales(36),
    height: scales(36),
    resizeMode: "contain",
  },
  title: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(22),
    textAlign: "center",
  },
  subtitle: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(14),
    textAlign: "center",
    marginTop: scales(6),
  },
  trackOuter: {
    width: "100%",
    height: scales(6),
    borderRadius: scales(3),
    backgroundColor: colors.transparentWhite10,
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    borderRadius: scales(3),
    backgroundColor: colors.storyRing,
  },
  percent: {
    color: colors.storyRing,
    fontFamily: fontFamily.bold,
    fontSize: scales(13),
    marginTop: scales(8),
    alignSelf: "flex-end",
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: scales(20),
  },
  stepItem: {
    alignItems: "center",
    gap: scales(4),
  },
  stepDot: {
    width: scales(8),
    height: scales(8),
    borderRadius: scales(4),
    backgroundColor: colors.transparentWhite15,
  },
  stepDotActive: {
    backgroundColor: colors.storyRing,
  },
  stepDotDone: {
    backgroundColor: colors.lightGreen,
  },
  stepText: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(10),
  },
  stepTextActive: {
    color: colors.white,
    fontFamily: fontFamily.medium,
  },
  doneActions: {
    width: "100%",
    gap: scales(12),
  },
  doneBtn: {
    backgroundColor: colors.storyRing,
    paddingVertical: scales(14),
    borderRadius: scales(12),
    alignItems: "center",
  },
  doneBtnText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(15),
  },
  doneBtnSecondary: {
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite15,
  },
  doneBtnSecondaryText: {
    color: colors.transparentWhite85,
  },
});
