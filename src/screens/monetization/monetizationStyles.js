import { StyleSheet } from "react-native";
import { colors, scales } from "../../utils";
import { fontFamily } from "../../assets";

export const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: scales(20),
    paddingTop: scales(12),
    paddingBottom: scales(60),
  },
  heroContainer: {
    marginBottom: scales(24),
    marginTop: scales(8),
  },
  title: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(26),
    marginBottom: scales(8),
  },
  subtitle: {
    color: colors.silverSubtitle,
    fontFamily: fontFamily.regular,
    fontSize: scales(14),
    lineHeight: scales(22),
  },
  sectionTitle: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(16),
    marginBottom: scales(12),
    marginLeft: scales(4),
  },
  card: {
    backgroundColor: colors.transparentWhite5,
    borderRadius: scales(20),
    padding: scales(18),
    borderWidth: 1,
    borderColor: colors.transparentWhite12,
    marginBottom: scales(26),
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scales(8),
    gap: scales(14),
  },
  checkCircle: {
    width: scales(28),
    height: scales(28),
    borderRadius: scales(14),
    backgroundColor: colors.lightGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    width: scales(14),
    height: scales(14),
    tintColor: colors.white,
    resizeMode: "contain",
  },
  checkText: {
    color: colors.white,
    fontFamily: fontFamily.medium,
    fontSize: scales(14),
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.transparentWhite10,
    marginVertical: scales(6),
  },
  inputSpacing: {
    marginBottom: scales(16),
  },
  agreementRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: scales(12),
    marginBottom: scales(16),
  },
  checkBox: {
    width: scales(24),
    height: scales(24),
    borderRadius: scales(6),
    borderWidth: 2,
    borderColor: colors.storyRing,
    alignItems: "center",
    justifyContent: "center",
    marginTop: scales(2),
    backgroundColor: "transparent",
  },
  checkBoxChecked: {
    backgroundColor: colors.storyRing,
  },
  checkBoxIcon: {
    width: scales(13),
    height: scales(13),
    tintColor: colors.white,
    resizeMode: "contain",
  },
  agreementText: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
    lineHeight: scales(20),
    flex: 1,
  },
  submitButtonWrapper: {
    marginTop: scales(10),
    marginBottom: scales(20),
  },
  disabledButton: {
    opacity: 0.5,
  },
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scales(60),
    paddingHorizontal: scales(16),
  },
  lottieIcon: {
    width: scales(140),
    height: scales(140),
  },
  successTitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(24),
    textAlign: "center",
    marginTop: scales(24),
    marginBottom: scales(12),
  },
  successDescription: {
    color: colors.silverSubtitle,
    fontFamily: fontFamily.regular,
    fontSize: scales(14),
    lineHeight: scales(22),
    textAlign: "center",
    marginBottom: scales(36),
  },
  returnButtonWrapper: {
    width: "100%",
  },
});
