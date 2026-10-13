import React from 'react';
import {View} from 'react-native';

export const Spacer = ({height = 10, width = '100%', background, flex}) => {
  return (
    <View
      style={{height: height, width: width, background: background, flex}}
    />
  );
};
