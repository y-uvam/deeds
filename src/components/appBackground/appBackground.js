import {ImageBackground, StyleSheet, View} from 'react-native';
import {appImages} from '../../assets/icons/appImages';
import {colors, topInset} from '../../utils';

export const AppBackground = ({children, style, isTopInset = true}) => {
  return (
    <ImageBackground
      source={appImages.appBackground}
      style={{...styles.container}}
      resizeMode="cover">
      <View style={{flex: 1, paddingTop: isTopInset && topInset, ...style}}>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },  
});