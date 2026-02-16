import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {appImages, fontFamily} from '../../assets';
import {colors, scales} from '../../utils';
import {goBack} from '../../navigation';
export const Header = ({label, showBackButton}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        {showBackButton && (
          <TouchableOpacity
            onPress={() => {
              goBack();
            }}
            style={styles.backButton}>
            <Image source={appImages.backarrow} style={styles.backImage} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.headerLabel}>{label}</Text>
      </View>

      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
  },
  backImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  backText: {
    fontSize: scales(18),
    fontFamily: fontFamily.regular,
    color: colors.black,
    marginLeft: 5,
    alignSelf: 'center',
    fontWeight: '600',
  },
  headerLabel: {
    fontWeight: '600',
    fontFamily: fontFamily.regular,
    color: colors.black,
    fontSize: scales(20),
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderColor,
    marginTop: 10,
  },
});
