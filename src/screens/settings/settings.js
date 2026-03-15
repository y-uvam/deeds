import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomSkeleton } from '../../components';
import { colors } from '../../utils';

export const Settings = () => {
  return (
    <View style={styles.container}>

      <Text>Settings Screen</Text>
       <CustomSkeleton variant="profile"/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
        backgroundColor:colors.black
    
  },
});
