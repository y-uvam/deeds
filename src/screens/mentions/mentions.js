import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { AppBackground, Header, NextButton } from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { showCustomMessage } from "../../helper/FlashMessage";

export const TagsAndMentions = () => {
  const [tagPermission, setTagPermission] = useState("All Creators & Studios");
  const [mentionPermission, setMentionPermission] = useState(
    "Anyone in Community",
  );
  const [notifySlates, setNotifySlates] = useState(true);

  const Section = ({ title, subtitle, children }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  const handleSelectTag = (opt) => {
    setTagPermission(opt);
    showCustomMessage(`Cast & movie tagging allowed for: ${opt}`, "success");
  };

  const handleSelectMention = (opt) => {
    setMentionPermission(opt);
    showCustomMessage(`Comment mentions allowed for: ${opt}`, "success");
  };

  const tagOptions = [
    { label: "All Creators & Studios", icon: appImages.everyone },
    { label: "Followed Artists & Verified Only", icon: appImages.following },
    { label: "Nobody (Disable Tagging)", icon: appImages.blocked },
  ];

  const mentionOptions = [
    { label: "Anyone in Community", icon: appImages.everyone },
    { label: "Only Profiles I Follow", icon: appImages.following },
    { label: "Nobody", icon: appImages.blocked },
  ];

  return (
    <AppBackground>
      <Header label={commonText.tagsAndMentions} showBackButton={true} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Section
          title="Movie & Cast Credit Tagging"
          subtitle="Control who can tag your profile in movie slates, posters, and production cast lists."
        >
          {tagOptions.map((item) => {
            const isSel = tagPermission === item.label;
            return (
              <NextButton
                key={`tag-${item.label}`}
                leftIcon={item.icon}
                label={item.label}
                isSelected={isSel}
                isSwitch={true}
                switchValue={isSel}
                onSwitchChange={() => handleSelectTag(item.label)}
                onPress={() => handleSelectTag(item.label)}
              />
            );
          })}
        </Section>

        <Section
          title="Reviews & Comment Mentions"
          subtitle="Manage who can directly @mention your handle in community discussions, reviews, and threads."
        >
          {mentionOptions.map((item) => {
            const isSel = mentionPermission === item.label;
            return (
              <NextButton
                key={`mention-${item.label}`}
                leftIcon={item.icon}
                label={item.label}
                isSelected={isSel}
                isSwitch={true}
                switchValue={isSel}
                onSwitchChange={() => handleSelectMention(item.label)}
                onPress={() => handleSelectMention(item.label)}
              />
            );
          })}
        </Section>

        <Section title="Mention Alerts & Sync">
          <NextButton
            leftIcon={appImages.slate}
            label="Notify on Production Slates"
            isSwitch={true}
            switchValue={notifySlates}
            onSwitchChange={(val) => {
              setNotifySlates(val);
              showCustomMessage(
                val
                  ? "Slate & project mention notifications enabled"
                  : "Slate mention notifications muted",
                "info",
              );
            }}
          />
        </Section>
      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: scales(30),
    paddingTop: scales(14),
  },
  sectionContainer: {
    marginHorizontal: scales(16),
    marginBottom: scales(26),
  },
  sectionTitle: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(17),
    marginLeft: scales(4),
  },
  sectionSubtitle: {
    color: colors.white,
    fontFamily: fontFamily.regular,
    fontSize: scales(12),
    lineHeight: scales(17),
    marginLeft: scales(4),
    marginTop: scales(4),
    marginBottom: scales(12),
  },
  sectionCard: {
    backgroundColor: colors.transparentWhite5,
    borderRadius: scales(20),
    paddingVertical: scales(5),
    borderWidth: 1,
    borderColor: colors.transparentWhite8,
    marginTop: scales(10),
  },
});
