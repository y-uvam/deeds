import { StyleSheet, Dimensions } from "react-native";
import { colors, scales } from "../../utils";
import { fontFamily } from "../../assets";

const { width } = Dimensions.get("window");
export const THUMB_SIZE = (width - scales(52)) / 3;

export const styles = StyleSheet.create({
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scales(20),
    paddingVertical: scales(10),
  },
  infoLabel: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(15),
  },
  infoCount: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
  },
  grid: {
    paddingHorizontal: scales(16),
    paddingBottom: scales(20),
    gap: scales(4),
  },
  gridRow: {
    gap: scales(4),
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: scales(8),
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbSelected: {
    borderColor: colors.storyRing,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  videoBadge: {
    position: "absolute",
    bottom: scales(4),
    left: scales(4),
    flexDirection: "row",
    alignItems: "center",
    gap: scales(3),
    backgroundColor: colors.transparentBlack30,
    borderRadius: scales(4),
    paddingHorizontal: scales(4),
    paddingVertical: scales(2),
  },
  playIcon: {
    width: scales(10),
    height: scales(10),
    resizeMode: "contain",
  },
  durationText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(9),
  },
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.transparentBlack30,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: scales(6),
  },
  selectionBadge: {
    width: scales(22),
    height: scales(22),
    borderRadius: scales(11),
    backgroundColor: colors.storyRing,
    justifyContent: "center",
    alignItems: "center",
  },
  selectionNum: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(11),
  },
  footer: {
    paddingHorizontal: scales(20),
    paddingBottom: scales(30),
  },
});
