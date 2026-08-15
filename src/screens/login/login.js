import React, { useCallback, useEffect, useRef, useState } from "react";
import { GOOGLE_WEB_CLIENT_ID } from "@env";
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import LottieView from "lottie-react-native";
import { animations } from "../../animations/animations";
import { appImages } from "../../assets";
import { colors, scales, topInset } from "../../utils";
import { commonText } from "../../utils/commonText";
import { useDispatch } from "react-redux";
import { CustomBottomSheet } from "../../components";
import { goBack, reset } from "../../navigation/navigationServices";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { showCustomMessage } from "../../helper/FlashMessage";
import { routesConstants } from "../../navigation";

const { width: SCREEN_W } = Dimensions.get("window");

export const Login = () => {
  const dispatch = useDispatch();
  const termsSheetRef = useRef(null);

  const [legalTitle, setLegalTitle] = useState("Terms of Service");

  const handleSocialPress = useCallback(async (provider) => {
    if (provider === "Google") {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log(userInfo);
        reset(routesConstants.BottomTabs);
      } catch (error) {
        console.log(error);
        showCustomMessage(error.message, "error");
      }
    }
  }, []);

  const handleBack = useCallback(() => {
    goBack();
  }, []);

  const openLegalSheet = useCallback((title) => {
    setLegalTitle(title);
    termsSheetRef.current?.present();
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Hero Background */}
      <View style={styles.heroContainer}>
        <Image
          source={appImages.poster4}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", colors.background + "aa", colors.background]}
          locations={[0, 0.5, 1]}
          style={styles.gradientFade}
        />
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        activeOpacity={0.7}
        onPress={handleBack}
      >
        <Image
          style={styles.backIcon}
          source={appImages.backarrow}
          tintColor={colors.white}
        />
      </TouchableOpacity>

      {/* Auth Content Area */}
      <View style={styles.contentArea}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{commonText.welcomeMessage}</Text>
          <Text style={styles.subtitle}>{commonText.letstart}</Text>
        </View>

        {/* Social Auth Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.authBtn}
            activeOpacity={0.82}
            onPress={() => handleSocialPress("Google")}
          >
            <LottieView
              source={animations.google}
              autoPlay
              loop
              style={styles.btnLottie}
            />
            <Text style={styles.authBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.authBtn}
            activeOpacity={0.82}
            onPress={() => handleSocialPress("Apple")}
          >
            <LottieView
              source={animations.Apple}
              autoPlay
              loop
              style={styles.btnLottieApple}
              colorFilters={[
                {
                  keypath: "**",
                  color: colors.white,
                },
              ]}
            />
            <Text style={styles.authBtnText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Trust Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{" "}
            <Text
              style={styles.footerLink}
              onPress={() => openLegalSheet("Terms of Service")}
            >
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text
              style={styles.footerLink}
              onPress={() => openLegalSheet("Privacy Policy")}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </View>
      </View>

      <CustomBottomSheet
        ref={termsSheetRef}
        snapPoints={["85%"]}
        enablePanDownToClose={true}
        useBlur={true}
        enableBackdrop={true}
        showCloseButton={true}
        title={legalTitle}
        subtitle="Please review carefully before proceeding."
      >
        <View style={styles.legalContent}>
          <Text style={styles.legalBody}>{commonText.dummyText}</Text>
        </View>
      </CustomBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "64%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    transform: [{ scale: 1.25 }],
  },
  gradientFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
  },
  backBtn: {
    position: "absolute",
    top: topInset + scales(12),
    left: scales(20),
    width: scales(38),
    height: scales(38),
    borderRadius: scales(19),
    backgroundColor: colors.transparentWhite8,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  backIcon: {
    height: scales(14),
    width: scales(14),
    resizeMode: "contain",
  },
  contentArea: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: scales(24),
    paddingBottom: scales(36),
  },
  textContainer: {
    alignItems: "center",
    marginBottom: scales(24),
  },
  title: {
    color: colors.white,
    fontSize: scales(28),
    fontFamily: fontFamily.black,
    letterSpacing: 0.3,
    textAlign: "center",
    marginBottom: scales(10),
  },
  subtitle: {
    color: colors.transparentWhite40,
    fontSize: scales(15),
    fontFamily: fontFamily.regular,
    lineHeight: scales(22),
    textAlign: "center",
    maxWidth: SCREEN_W * 0.84,
  },
  buttonsContainer: {
    width: "82%",
    alignSelf: "center",
    marginBottom: scales(24),
  },
  authBtn: {
    width: "100%",
    height: scales(52),
    borderRadius: scales(26),
    backgroundColor: colors.transparentWhite8,
    borderWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scales(16),
    gap: scales(10),
  },
  authBtnText: {
    color: colors.white,
    fontSize: scales(14),
    fontFamily: fontFamily.bold,
    letterSpacing: 0.3,
  },
  btnLottie: {
    width: scales(45),
    height: scales(45),
  },
  btnLottieApple: {
    width: scales(35),
    height: scales(35),
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: scales(12),
    paddingHorizontal: scales(8),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.transparentWhite12,
  },
  dividerText: {
    color: colors.transparentWhite40,
    fontSize: scales(11),
    fontFamily: fontFamily.bold,
    letterSpacing: 2,
    marginHorizontal: scales(12),
  },
  footerContainer: {
    paddingHorizontal: scales(12),
    alignItems: "center",
  },
  footerText: {
    color: colors.transparentWhite40,
    fontSize: scales(11),
    fontFamily: fontFamily.regular,
    lineHeight: scales(16),
    textAlign: "center",
  },
  footerLink: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.medium,
    textDecorationLine: "underline",
  },
  sheetForm: {
    paddingVertical: scales(8),
  },
  legalContent: {
    paddingVertical: scales(10),
  },
  legalBody: {
    color: colors.transparentWhite85,
    fontSize: scales(14),
    fontFamily: fontFamily.regular,
    lineHeight: scales(22),
  },
});
