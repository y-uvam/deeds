import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Routes from './src/navigation/routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Loader } from './src/components';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
//vagama6094@fentaoba.com
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
   <GestureHandlerRootView style={{flex: 1}}>
    <SafeAreaProvider>
<BottomSheetModalProvider>
      <View style={styles.container}>
      <StatusBar barStyle={isDarkMode?'dark-content':'light-content'} />
        {/* <KeyboardProvider> */}
            <Routes />
            {/* <Loader /> */}
        {/* </KeyboardProvider> */}
      </View>
      </BottomSheetModalProvider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
