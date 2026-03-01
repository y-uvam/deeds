import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomInput } from '../../components';
import { AppBackground } from '../../components';

export const Dashboard = () => {
  return (
   <AppBackground>
    <View style={styles.container}>
      <Text>Dashboard Screen</Text>
      <CustomInput/>
    </View>
   </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
