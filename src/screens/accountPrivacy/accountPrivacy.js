import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { AppBackground, Header, NextButton } from "../../components";
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
      "success",
    );
  };

  return (
    <AppBackground>
      <Header label={commonText.accountPrivacy} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Section title={"Your Privacy"}>
          <NextButton
            leftIcon={appImages.lock}
            label="Private Account"
            isSwitch={true}
            switchValue={isPrivate}
            onSwitchChange={handleToggle}
          />
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
});
