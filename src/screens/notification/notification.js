import { View, Text, StyleSheet } from 'react-native';
import { CustomSkeleton } from '../../components';
import { colors } from '../../utils';

export const Notification = () => {
  return (
    <View style={styles.container}>
      <Text>Notification Screen</Text>
       <CustomSkeleton variant="listItem"/>
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
