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
            onPress={() =>
              navigate(routesConstants.savedPosts, { type: "Likes" })
            }
          />
          <NextButton
            leftIcon={appImages.comment}
            label="Comments"
            onPress={() =>
              navigate(routesConstants.review, { type: "comments" })
            }
          />
          <NextButton
            leftIcon={appImages.star}
            label="Ratings"
            onPress={() => navigate(routesConstants.review, { type: "rating" })}
          />
        </Section>

        <Section title="Saved & History">
          <NextButton
            leftIcon={appImages.saved}
            label="Saved Posts"
            onPress={() =>
              navigate(routesConstants.savedPosts, { type: "Saved Posts" })
            }
          />
          <NextButton
            leftIcon={appImages.history}
            label="History"
            onPress={() =>
              navigate(routesConstants.savedPosts, { type: "History" })
            }
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
