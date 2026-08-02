import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { AppBackground, Header, NextButton } from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { showCustomMessage } from "../../helper/FlashMessage";

export const Monetization = () => {
  const Section = ({ title, children }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  return (
    <AppBackground>
      <Header label={commonText.monetization} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Section title="Creator Tools">
          <NextButton
            leftIcon={appImages.star}
            label="Badges"
            onPress={() => showCustomMessage("Viewing Badges eligibility...", "info")}
          />
          <NextButton
            leftIcon={appImages.heart}
            label="Subscriptions"
            onPress={() => showCustomMessage("No active fan subscriptions yet.", "info")}
          />
          <NextButton
            leftIcon={appImages.monetize}
            label="Bonuses"
            onPress={() => showCustomMessage("You are eligible for Creator Bonuses!", "success")}
          />
        </Section>
        <Section title="Payouts & Settings">
          <NextButton
            leftIcon={appImages.project}
            label="Payment Methods"
            onPress={() => showCustomMessage("Managing linked payment methods...", "info")}
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
