import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, scales } from "../../utils";
import { fontFamily } from "../../assets";
import { useNetworkStatus, useSyncState } from "../../graphql";

export const OfflineSyncBanner = () => {
  const { isOnline } = useNetworkStatus();
  const { pendingCount } = useSyncState();

  if (!isOnline) {
    return (
      <View style={[styles.container, styles.offline]}>
        <Text style={styles.text}>
          Waiting for network... {pendingCount > 0 ? `(${pendingCount} pending)` : ""}
        </Text>
      </View>
    );
  }

  if (pendingCount > 0) {
    return (
      <View style={[styles.container, styles.syncing]}>
        <Text style={styles.text}>Syncing {pendingCount} offline changes...</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: scales(6),
    paddingHorizontal: scales(12),
    alignItems: "center",
    justifyContent: "center",
  },
  offline: {
    backgroundColor: colors.darkblack,
  },
  syncing: {
    backgroundColor: colors.primaryBlue,
  },
  text: {
    color: colors.white,
    fontFamily: fontFamily.Regular,
    fontSize: scales(12),
  },
});
