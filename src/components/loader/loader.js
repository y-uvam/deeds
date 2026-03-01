
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

export const Loader = props => {
//   const {isLoading} = useSelector(state => state.global);

  return (
    <>
      {/* {isLoading  ? (
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              color={colors.primary}
              size={'large'}
              animating={true}
            />
          </View>
        </View>
      ) : null} */}
    </>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  activityIndicatorWrapper: {
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
