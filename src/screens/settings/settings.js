import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  AppBackground,
  CustomSkeleton,
  Header,
  NextButton,
} from "../../components";
import { colors, commonText } from "../../utils";
import { appImages } from "../../assets";

export const Settings = () => {
  return (
    <AppBackground>
      <Header label={commonText.settings} showBackButton={true} />
      <NextButton
        leftIcon={appImages.saved}
        label={commonText.saved}
        onPress={() => {}}
      />
      <NextButton
        leftIcon={appImages.archive}
        label={commonText.archive}
        onPress={() => {}}
      />
      <NextButton
        leftIcon={appImages.yourActivity}
        label={commonText.yourActivity}
        onPress={() => {}}
      />
      <NextButton
        leftIcon={appImages.lock}
        label={commonText.accountPrivacy}
        onPress={() => {}}
      />
      <NextButton
        leftIcon={appImages.blocked}
        label={commonText.blocked}
        onPress={() => {}}
      />
    </AppBackground>
  );
};

const styles = StyleSheet.create({});
