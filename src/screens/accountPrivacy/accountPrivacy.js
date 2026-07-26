import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { AppBackground, Header, NextButton, CustomSwitch } from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { navigate, routesConstants } from "../../navigation";
import { showCustomMessage } from "../../helper/FlashMessage";

export const AccountPrivacy = () => {
  const [isPrivate, setIsPrivate] = useState(false);

  const Section = ({ title, children }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  const handleToggle = (value) => {
    setIsPrivate(value);
    showCustomMessage(
      value ? "Account is now Private" : "Account is now Public",
      "success"
    );
  };

  return (
    <AppBackground>
      <Header label={commonText.accountPrivacy} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Section title="Account Privacy">
          <View style={styles.switchContainer}>
            <View style={styles.leftContainer}>
              <Image source={appImages.lock} style={styles.leftIcon} />
              <Text style={styles.label}>Private Account</Text>
            </View>
            <CustomSwitch value={isPrivate} onValueChange={handleToggle} />
          </View>
        </Section>

        <Section title="Interactions">
          <NextButton
            leftIcon={appImages.blocked}
            label="Blocked Accounts"
            onPress={() => navigate(routesConstants.blocked)}
          />
          <NextButton
            leftIcon={appImages.mention}
            label="Tags and Mentions"
            onPress={() => navigate(routesConstants.mentions)}
          />
        </Section>

        <Section title="Connections">
          <NextButton
            leftIcon={appImages.accountPrivacy}
            label="Device Permissions"
            onPress={() => navigate(routesConstants.devicePermissions)}
          />
        </Section>
      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: scales(20), paddingTop: scales(20) },
  sectionContainer: { marginHorizontal: scales(16), marginBottom: scales(24) },
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scales(10),
    marginVertical: scales(5),
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(10),
  },
  leftIcon: {
    height: 25,
    width: 25,
    tintColor: colors.white,
  },
  label: {
    fontFamily: fontFamily.regular,
    color: colors.white,
    fontSize: scales(16),
  },
});
