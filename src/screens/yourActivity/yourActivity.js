import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { AppBackground, Header, NextButton } from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { navigate, routesConstants } from "../../navigation";
import { showCustomMessage } from "../../helper/FlashMessage";

export const YourActivity = () => {
  const Section = ({ title, children }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  return (
    <AppBackground>
      <Header label={commonText.yourActivity} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Section title="Interactions">
          <NextButton
            leftIcon={appImages.like}
            label="Likes"
            onPress={() => showCustomMessage("Showing likes history...", "info")}
          />
          <NextButton
            leftIcon={appImages.comment}
            label="Comments"
            onPress={() => showCustomMessage("Showing comments history...", "info")}
          />
          <NextButton
            leftIcon={appImages.tag}
            label="Tags & Mentions"
            onPress={() => showCustomMessage("Showing tags and mentions...", "info")}
          />
        </Section>

        <Section title="Information & Content">
          <NextButton
            leftIcon={appImages.saved}
            label="Saved Posts"
            onPress={() => navigate(routesConstants.savedPosts)}
          />
          <NextButton
            leftIcon={appImages.browse}
            label="Recent Searches"
            onPress={() => showCustomMessage("Recent searches are empty.", "info")}
          />
          <NextButton
            leftIcon={appImages.dataUsage}
            label="Data Usage"
            onPress={() => navigate(routesConstants.dataUsage)}
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
