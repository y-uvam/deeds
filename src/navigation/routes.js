import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './navigationServices';
import MainStack from './mainStack';

const Routes = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <MainStack />
    </NavigationContainer>
  );
};

export default Routes;
