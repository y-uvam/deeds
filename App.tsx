import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Routes from './src/navigation/routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Loader } from './src/components';
//vagama6094@fentaoba.com
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
   <GestureHandlerRootView style={{flex: 1}}>
    <SafeAreaProvider>
      <View style={styles.container}>
      <StatusBar barStyle={isDarkMode?'light-content':'dark-content'} />
        {/* <KeyboardProvider> */}
            <Routes />
            {/* <Loader /> */}
        {/* </KeyboardProvider> */}
      </View>
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
