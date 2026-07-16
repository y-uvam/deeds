import { StyleSheet } from "react-native";
import { colors, scales, width } from "../../utils";
import { fontFamily } from "../../assets";

export const styles = StyleSheet.create({
  card: {
    marginBottom: scales(2),
  },
  slideWrapper: {
    width,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width,
    overflow: "hidden",
  },
  postImage: {
    width,
    height: width * 1.05,
  },
  heartOverlay: {
    position: "absolute",
    alignSelf: "center",
  },
  heartEmoji: {
    fontSize: scales(90),
  },
  badgeWrapper: {
    position: "absolute",
    top: scales(14),
    right: scales(14),
    borderRadius: scales(12),
    overflow: "hidden",
  },
  blurBadge: {
    borderRadius: scales(12),
  },
  badgeInner: {
    paddingHorizontal: scales(10),
    paddingVertical: scales(4),
    backgroundColor: colors.transparentBlack25,
    borderRadius: scales(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.transparentWhite15,
  },
  badgeText: {
    color: colors.white,
    fontSize: scales(12),
    fontFamily: fontFamily.bold,
    letterSpacing: 0.5,
  },
  badgeSeparator: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
  },
  dotsRow: {
    position: "absolute",
    bottom: scales(12),
    alignSelf: "center",
    borderRadius: scales(12),
    overflow: "hidden",
  },
  dotsBlur: {
    borderRadius: scales(12),
  },
  dotsInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scales(10),
    paddingVertical: scales(6),
    backgroundColor: colors.transparentBlack30,
    borderRadius: scales(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.transparentWhite12,
  },
  animOverlay: {
    position: "absolute",
    top: "25%",
    left: scales(20),
    width: scales(130),
    height: scales(130),
    zIndex: 10,
    pointerEvents: "none",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scales(14),
    paddingTop: scales(12),
    paddingBottom: scales(4),
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarRing: {
    width: scales(42),
    height: scales(42),
    borderRadius: scales(21),
    padding: scales(2),
    borderWidth: 2,
    borderColor: colors.storyRing,
    marginRight: scales(10),
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: scales(19),
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(14),
  },
  profileMeta: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(11),
    marginTop: scales(1),
  },
  moreBtn: {
    width: scales(36),
    height: scales(36),
    justifyContent: "center",
    alignItems: "center",
  },
  moreIcon: {
    width: scales(18),
    height: scales(18),
    resizeMode: "contain",
  },
  descriptionContainer: {
    paddingHorizontal: scales(16),
    paddingTop: scales(6),
    paddingBottom: scales(10),
  },
  descriptionText: {
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
    color: colors.transparentWhite85,
    lineHeight: scales(20),
  },
  viewMoreText: {
    fontFamily: fontFamily.semiBold,
    fontSize: scales(13),
    color: colors.transparentWhite40,
    marginTop: scales(3),
  },
  actionBarWrapper: {
    borderRadius: 20,
    width: "90%",
    alignSelf: "center",
    overflow: "hidden",
  },
  actionBarInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: scales(12),
    backgroundColor: colors.transparentWhite5,
  },
  actionBtn: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: scales(10),
  },
  actionIcon: {
    width: scales(22),
    height: scales(22),
    resizeMode: "contain",
  },
  actionLabel: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(12),
    marginTop: scales(3),
  },
  actionDivider: {
    width: StyleSheet.hairlineWidth,
    height: scales(22),
    backgroundColor: colors.transparentWhite15,
  },
});
