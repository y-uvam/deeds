import { StyleSheet } from "react-native";
import { colors, scales } from "../../utils";
import { fontFamily } from "../../assets";

export const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  heading: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(22),
  },
  subheading: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
    marginTop: scales(4),
  },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.transparentWhite15,
    borderRadius: scales(16),
    paddingHorizontal: scales(16),
    paddingVertical: scales(16),
    marginBottom: scales(12),
    backgroundColor: colors.transparentWhite5,
    gap: scales(14),
  },
  iconCircle: {
    width: scales(48),
    height: scales(48),
    borderRadius: scales(24),
    justifyContent: "center",
    alignItems: "center",
  },
  typeIcon: {
    width: scales(22),
    height: scales(22),
  },
  typeTextBlock: {
    flex: 1,
  },
  typeLabel: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(16),
  },
  typeSubtitle: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(12),
    marginTop: scales(2),
  },
  radioOuter: {
    width: scales(20),
    height: scales(20),
    borderRadius: scales(10),
    borderWidth: 2,
    borderColor: colors.transparentWhite40,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: scales(10),
    height: scales(10),
    borderRadius: scales(5),
  },
});
