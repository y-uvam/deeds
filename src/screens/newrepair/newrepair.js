import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Newrepair = () => {
  return (
    <View style={styles.container}>
      <Text>New Repair Screen</Text>
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
