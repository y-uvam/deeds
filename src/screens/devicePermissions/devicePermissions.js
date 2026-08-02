import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { AppBackground, Header, NextButton } from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { showCustomMessage } from "../../helper/FlashMessage";

export const DevicePermissions = () => {
  const [permissions, setPermissions] = useState({
    camera: true,
    mic: true,
    location: false,
    notifications: true,
  });

  const handleToggle = (key, label, value) => {
    setPermissions((prev) => ({ ...prev, [key]: value }));
    showCustomMessage(
      `${label} access ${value ? "enabled" : "disabled"}`,
      value ? "success" : "info"
    );
  };

  const Section = ({ title, children }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  return (
    <AppBackground>
      <Header label={commonText.DevicePermissions} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Section title="Device Permissions">
          <NextButton
            leftIcon={appImages.camera}
            label="Camera"
            isSwitch={true}
            switchValue={permissions.camera}
            onSwitchChange={(val) => handleToggle("camera", "Camera", val)}
          />
          <NextButton
            leftIcon={appImages.mic}
            label="Microphone"
            isSwitch={true}
            switchValue={permissions.mic}
            onSwitchChange={(val) => handleToggle("mic", "Microphone", val)}
          />
          <NextButton
            leftIcon={appImages.location}
            label="Location Services"
            isSwitch={true}
            switchValue={permissions.location}
            onSwitchChange={(val) => handleToggle("location", "Location", val)}
          />
          <NextButton
            leftIcon={appImages.bell}
            label="Push Notifications"
            isSwitch={true}
            switchValue={permissions.notifications}
            onSwitchChange={(val) => handleToggle("notifications", "Notifications", val)}
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
