import { StyleSheet } from "react-native";
import { colors, scales, width } from "../../utils";
import { fontFamily } from "../../assets";

const DOT_SIZE = scales(6);
const DOT_ACTIVE_WIDTH = scales(14);

export const styles = StyleSheet.create({
  container: {
    borderRadius: scales(20),
    overflow: "hidden",
    paddingBottom: scales(12),
  },
  postImage: {
    // width: "100%",
    height: scales(300),
  },
  animLikeOverlay: {
    position: "absolute",
    top: "25%",
    left: scales(20),
    width: scales(140),
    height: scales(140),
    zIndex: 10,
    pointerEvents: "none",
  },
  animSaveOverlay: {
    position: "absolute",
    top: "25%",
    right: scales(20),
    width: scales(140),
    height: scales(140),
    zIndex: 10,
    pointerEvents: "none",
  },
  badgeWrapper: {
    position: "absolute",
    top: scales(10),
    right: scales(12),
    borderRadius: scales(20),
    overflow: "hidden",
    alignItems: "center",
  },
  blurBadge: {
    paddingHorizontal: scales(10),
    paddingVertical: scales(4),
    borderRadius: scales(20),
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(12),
    textAlign: "center",
    marginTop: scales(2),
  },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scales(5),
    marginTop: scales(8),
  },
  dot: {
    width: scales(6),
    height: scales(6),
    borderRadius: scales(3),
    backgroundColor: colors.gray,
  },
  dotActive: {
    backgroundColor: colors.blue,
    width: scales(18),
    borderRadius: scales(3),
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scales(14),
    marginTop: scales(10),
  },
  actionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(20),
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(6),
  },
  iconLike: {
    width: scales(24),
    height: scales(22),
    resizeMode: "contain",
  },
  iconComment: {
    width: scales(24),
    height: scales(24),
    resizeMode: "contain",
  },
  iconShare: {
    width: scales(24),
    height: scales(22),
    resizeMode: "contain",
  },
  iconSave: {
    width: scales(20),
    height: scales(24),
    resizeMode: "contain",
  },
  actionText: {
    fontFamily: fontFamily.medium,
    fontSize: scales(13),
    color: colors.white,
  },

  // ── Description ──
  descriptionContainer: {
    paddingHorizontal: scales(14),
    marginTop: scales(8),
  },
  descriptionText: {
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
    color: colors.white,
    lineHeight: scales(20),
  },
  viewMoreText: {
    fontFamily: fontFamily.semiBold,
    fontSize: scales(13),
    color: colors.gray,
    marginTop: scales(2),
  },
  root: {
    width: width,
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
    height: width * 1.1,
  },
  imageEdgeFade: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  heartOverlay: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  heartEmoji: {
    fontSize: scales(80),
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
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: scales(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.15)",
  },
  badgeText: {
    color: colors.white,
    fontSize: scales(12),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  badgeSeparator: {
    color: "rgba(255,255,255,0.4)",
    fontWeight: "400",
  },
  dotsRow: {
    position: "absolute",
    bottom: scales(14),
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
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: scales(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.12)",
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.white,
    marginHorizontal: scales(2),
    opacity: 0.3,
  },
  dotActive: {
    width: DOT_ACTIVE_WIDTH,
    opacity: 1,
  },
});
