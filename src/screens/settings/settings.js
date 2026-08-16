import React, { useCallback, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  AppBackground,
  Header,
  NextButton,
  CustomBottomSheet,
  CustomButton,
} from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { navigate, reset, routesConstants } from "../../navigation";
import { useDispatch } from "react-redux";
import { resetPersistStore } from "../../redux/slices/persistedSlice";
import { showCustomMessage } from "../../helper/FlashMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tokenManager } from "../../helper/createMMKV";

export const Settings = () => {
  const dispatch = useDispatch();
  const actionSheetRef = useRef(null);
  const [actionType, setActionType] = useState("logout"); // "logout" | "deactivate"

  const handleLogout = useCallback(async () => {
    dispatch(resetPersistStore());
    await AsyncStorage.clear();
    showCustomMessage("Logged out successfully.", "info");
    reset(routesConstants.intro);
    tokenManager.clearToken();
  }, [dispatch]);

  const openLogoutConfirm = () => {
    setActionType("logout");
    actionSheetRef.current?.present();
  };

  const openDeactivateConfirm = () => {
    setActionType("deactivate");
    actionSheetRef.current?.present();
  };

  const handleYesAction = useCallback(() => {
    actionSheetRef.current?.dismiss();
    setTimeout(() => {
      if (actionType === "logout") {
        handleLogout();
      } else if (actionType === "deactivate") {
        showCustomMessage("Account deactivated successfully.", "info");
        handleLogout();
      }
    }, 250);
  }, [actionType, handleLogout]);

  const Section = ({ title, children }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  return (
    <AppBackground showAuthAnimation={true}>
      <Header label={commonText.settings} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Section title="Account & Activity">
          <NextButton
            leftIcon={appImages.yourActivity}
            label="Your Activity"
            onPress={() => navigate(routesConstants.yourActivity)}
          />
          <NextButton
            leftIcon={appImages.monetize}
            label="Monetization & Tools"
            onPress={() => navigate(routesConstants.monetization)}
          />
          <NextButton
            leftIcon={appImages.dataUsage}
            label="Data Usage & Media"
            onPress={() => navigate(routesConstants.dataUsage)}
          />
        </Section>

        <Section title="Privacy & Security">
          <NextButton
            leftIcon={appImages.lock}
            label="Account Privacy"
            onPress={() => navigate(routesConstants.accountPrivacy)}
          />
          <NextButton
            leftIcon={appImages.accountPrivacy}
            label="Device Permissions"
            onPress={() => navigate(routesConstants.devicePermissions)}
          />
        </Section>

        <Section title="For Professionals">
          <NextButton
            leftIcon={appImages.insights}
            label="Insights"
            onPress={() => navigate(routesConstants.insights)}
          />
          <NextButton
            leftIcon={appImages.finance}
            label="Financial"
            onPress={() => navigate(routesConstants.finance)}
          />
        </Section>

        <Section title="Login & Account Control">
          <NextButton
            leftIcon={appImages.logout}
            label="Log Out"
            onPress={openLogoutConfirm}
          />
          <NextButton
            leftIcon={appImages.bin}
            label="Deactivate Account"
            onPress={openDeactivateConfirm}
          />
        </Section>
      </ScrollView>

      <CustomBottomSheet
        ref={actionSheetRef}
        snapPoints={["36%"]}
        enablePanDownToClose={true}
        useBlur={true}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetHeading}>
            {actionType === "logout" ? "Log Out" : "Deactivate Account"}
          </Text>
          <Text style={styles.sheetDescription}>
            {actionType === "logout"
              ? "Are you sure you want to log out? You will need to sign back in to access your profile and messages."
              : "Are you sure you want to deactivate your account? Your profile, posts, and interactions will be hidden until you reactivate by logging in again."}
          </Text>
          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <CustomButton
                label="No"
                onPress={() => actionSheetRef.current?.dismiss()}
                gradientColors={[colors.profileBtnBg, colors.profileBtnBg]}
                labelStyle={{ color: colors.white }}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <CustomButton
                label="Yes"
                onPress={handleYesAction}
                gradientColors={
                  actionType === "deactivate"
                    ? [colors.red, colors.lightRed]
                    : [colors.orange, colors.storyRing, colors.lightRed]
                }
              />
            </View>
          </View>
        </View>
      </CustomBottomSheet>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: scales(20),
  },
  searchContainer: {
    marginBottom: scales(20),
  },
  sectionContainer: {
    marginHorizontal: scales(16),
    marginBottom: scales(24),
  },
  sectionTitle: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(18),
    marginBottom: scales(12),
    marginLeft: scales(4),
  },
  sectionCard: {
    backgroundColor: colors.transparentWhite5,
    borderRadius: scales(20),
    paddingVertical: scales(5),
  },
  sheetContent: {
    alignItems: "center",
    paddingHorizontal: scales(10),
    paddingBottom: scales(20),
  },
  sheetHeading: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(22),
    textAlign: "center",
    marginBottom: scales(12),
  },
  sheetDescription: {
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: fontFamily.regular,
    fontSize: scales(15),
    textAlign: "center",
    lineHeight: scales(22),
    marginBottom: scales(28),
    paddingHorizontal: scales(6),
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    gap: scales(15),
  },
  buttonWrapper: {
    flex: 1,
  },
});
