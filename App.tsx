import {StatusBar, StyleSheet, useColorScheme, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Routes from './src/navigation/routes';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {appImages} from './src/assets';
import {Provider, useDispatch} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import store, {persistor} from './src/redux/store/store';
import {setProfileData} from './src/redux/slices/persistedSlice';
import {useEffect} from 'react';
import FlashMessageComponent from './src/helper/FlashMessage';
import {TabBarProvider} from './src/context/TabBarContext';
function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useDispatch();
// and please keeep i mind use common components colors commontexts spacers 
// and right code in optimise way and dont add nything etc. and also please dont addd any comments
  const userData = {
    _id: '1',
    name: 'Yuvam Dhanda',
    email: 'yuvamdhanda975@gmail.com',
    gender: 'male',
    age: '21',
    profileImage: appImages.dummyuser,
  };

  useEffect(() => {
    dispatch(setProfileData(userData));
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <TabBarProvider>
            <View style={styles.container}>
              <StatusBar
                barStyle={isDarkMode ? 'dark-content' : 'light-content'}
              />
              <Routes />
              <FlashMessageComponent />
            </View>
          </TabBarProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
