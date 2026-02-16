import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CheckInbox = () => {
  return (
    <View style={styles.container}>
      <Text>Check Inbox Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
