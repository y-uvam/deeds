import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  AppBackground,
  CustomSearch,
  Header,
  NextButton,
} from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages, fontFamily } from "../../assets";

export const Settings = () => {
  const [searchText, setSearchText] = useState("");

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
        <CustomSearch
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search"
          containerStyle={styles.searchContainer}
        />

        <Section title="Activity">
          <NextButton
            leftIcon={appImages.dummyuser}
            label="Personal information"
            onPress={() => {}}
          />
          <NextButton
            leftIcon={appImages.saved}
            label="Saved"
            onPress={() => {}}
          />
          <NextButton
            leftIcon={appImages.blocked}
            label={commonText.blocked}
            onPress={() => {}}
          />
        </Section>

        <Section title="Support and security">
          <NextButton
            leftIcon={appImages.lock}
            label="Password and security"
            onPress={() => {}}
          />
          <NextButton
            leftIcon={appImages.chat}
            label="Help and support"
            onPress={() => {}}
          />
          <NextButton leftIcon={appImages.i} label="About" onPress={() => {}} />
        </Section>

        <Section title="Login and deactivation">
          <NextButton
            leftIcon={appImages.dummyuser}
            label="Login another account"
            onPress={() => {}}
          />
          <NextButton
            leftIcon={appImages.backarrow}
            label="Log out"
            onPress={() => {}}
          />
          <NextButton
            leftIcon={appImages.bin}
            label="Deactivate and delete"
            onPress={() => {}}
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
