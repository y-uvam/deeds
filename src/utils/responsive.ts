/* eslint-disable curly */
import {Dimensions} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';

export const {width, height} = Dimensions.get('window');
const guidelineBaseWidth = 375;

export const horizontalScale = (size: number) =>
  (width / guidelineBaseWidth) * size;

export const scales = (size: number, factor = 0.5) => {
  return size + (horizontalScale(size) - size) * factor;
};

export function hitSlope(size: number) {
  return {left: size, right: size, top: size, bottom: size};
}

export const topInset = initialWindowMetrics?.insets.top || 0;
export const bottomInset = initialWindowMetrics?.insets.bottom || 0;
