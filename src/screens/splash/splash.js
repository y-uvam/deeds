import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { routesConstants } from '../../navigation/routeConstants';
import { colors } from '../../utils';
import {animations} from '../../animations/animations'
export const Splash = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <LottieView
        source={animations.splash}
        autoPlay
        loop={false}
        onAnimationFinish={() => {
          navigation.replace(routesConstants.Login);
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
  },
});
