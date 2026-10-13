import { StyleSheet } from "react-native";
import { colors, scales } from "../../utils";
import { fontFamily } from "../../assets";

export const authStyles = StyleSheet.create({
  kav: {
    flex: 1,
  },
  logoArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: scales(72),
    height: scales(72),
    tintColor: "rgba(255,255,255,0.9)",
  },
  lottie: {
    width: "50%",
    height: "50%",
    alignSelf: "center",
  },
  form: {
    flex: 1,
  },
  forgotRow: {
    alignSelf: "flex-end",
  },
  forgotText: {
    fontSize: scales(13),
    fontFamily: fontFamily.medium,
    color: colors.blue,
    letterSpacing: 0.2,
  },
  button: {
    borderRadius: scales(14),
    paddingVertical: scales(17),
    backgroundColor: colors.primaryBlue,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 8,
    marginTop: scales(20),
  },
  buttonLabel: {
    fontSize: scales(16),
    fontFamily: fontFamily.bold,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: scales(20),
  },
  rowBase: {
    fontSize: scales(13),
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.55)",
  },
  rowLink: {
    fontSize: scales(13),
    fontFamily: fontFamily.medium,
    color: colors.blue,
    letterSpacing: 0.2,
  },
});
