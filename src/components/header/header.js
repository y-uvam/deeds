import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {appImages, fontFamily} from '../../assets';
import {colors, scales} from '../../utils';
import {goBack} from '../../navigation';
import {BlurView} from '@react-native-community/blur';

export const RoundIconButton = ({icon, onPress}) => {
  if (!icon) return null;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.roundButtonWrapper}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={15}
        reducedTransparencyFallbackColor="transparent"
      />
      <View style={[StyleSheet.absoluteFill]} />
      <Image source={icon} style={styles.iconImage}tintColor={colors.white} />
    </TouchableOpacity>
  );
};

export const HeaderPill = ({label}) => {
  if (!label) return null;
  return (
    <View style={styles.headerPillWrapper}>
      {/* <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={15}
        reducedTransparencyFallbackColor="transparent"
      /> */}
      <View style={[StyleSheet.absoluteFill, {}]} />
      <Text style={styles.headerLabel}>{label}</Text>
    </View>
  );
};

export const Header = ({label, showBackButton, rightIcon, onRightPress}) => {
  return (
    <View style={styles.container}>
      <View style={styles.sideContainer}>
        {showBackButton && (
          <RoundIconButton icon={appImages.backarrow} onPress={() => goBack()} />
        )}
      </View>

      <View style={styles.centerContainer}>
        <HeaderPill label={label} />
      </View>

      <View style={styles.sideContainerRight}>
        {rightIcon && (
          <RoundIconButton icon={rightIcon} onPress={onRightPress} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin:10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: scales(45),
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  sideContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: '100%',
  },
  sideContainerRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: '100%',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  roundButtonWrapper: {
    height: scales(40),
    width: scales(40),
    borderRadius: scales(20),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:colors.borderColor,
    borderWidth:1
  },
  iconImage: {
    height: scales(15),
    width: scales(15),
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  headerPillWrapper: {
    height: scales(40),
    paddingHorizontal: scales(20),
    borderRadius: scales(20),
    borderWidth: 1,
    borderColor: colors.borderColor,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLabel: {
    fontFamily: fontFamily.bold,
    color: colors.white,
    fontSize: scales(16),
    letterSpacing: 0.5,
  },
});
