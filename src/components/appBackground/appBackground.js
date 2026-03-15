import {StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
import {animations} from '../../animations/animations';
import {colors, topInset} from '../../utils';

export const AppBackground = ({children, style, isTopInset = true}) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={animations.background}
        autoPlay
        loop
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={{flex: 1, paddingTop: isTopInset && topInset, ...style}}>
        {children}
      </View>
    </View>
  );
};  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },  
});