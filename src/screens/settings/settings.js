import React, { useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { AppBackground, Header, NextButton } from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { navigate, reset, routesConstants } from "../../navigation";
import { useDispatch } from "react-redux";
import { resetPersistStore } from "../../redux/slices/persistedSlice";
import { showCustomMessage } from "../../helper/FlashMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Settings = () => {
  const dispatch = useDispatch();

  const handleLogout = useCallback(async () => {
    dispatch(resetPersistStore());
    await AsyncStorage.clear();
    showCustomMessage("Logged out successfully.", "info");
    reset(routesConstants.intro);
  }, [dispatch]);

  const Section = ({ title, children }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  return (
    <AppBackground>
      <Header label={commonText.settings} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Section title="Activity">
          <NextButton
            leftIcon={appImages.saved}
            label="Saved"
            onPress={() => {
              navigate(routesConstants.savedPosts);
            }}
          />
          <NextButton
            leftIcon={appImages.yourActivity}
            label="Your Activity"
            onPress={() => {
              navigate(routesConstants.yourActivity);
            }}
          />
          <NextButton
            leftIcon={appImages.mention}
            label="Tags and Mentions"
            onPress={() => {
              navigate(routesConstants.mentions);
            }}
          />
          <NextButton
            leftIcon={appImages.blocked}
            label={commonText.blocked}
            onPress={() => {
              navigate(routesConstants.blocked);
            }}
          />
        </Section>

        <Section title="Manage Account">
          <NextButton
            leftIcon={appImages.lock}
            label="Account Privacy"
            onPress={() => {
              navigate(routesConstants.accountPrivacy);
            }}
          />
          <NextButton
            leftIcon={appImages.accountPrivacy}
            label="Device Permissions"
            onPress={() => {
              navigate(routesConstants.devicePermissions);
            }}
          />
          <NextButton
            leftIcon={appImages.monetize}
            label="Monetization"
            onPress={() => {
              navigate(routesConstants.monetization);
            }}
          />
          <NextButton
            leftIcon={appImages.dataUsage}
            label="Data Usage"
            onPress={() => {
              navigate(routesConstants.dataUsage);
            }}
          />
        </Section>

        <Section title="Login and deactivation">
          <NextButton
            leftIcon={appImages.logout}
            label="Log Out"
            onPress={handleLogout}
          />
          <NextButton
            leftIcon={appImages.bin}
            label="Deactivate Account"
            onPress={handleLogout}
          />
        </Section>
      </ScrollView>
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
});
