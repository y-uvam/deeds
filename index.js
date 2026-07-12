/**
 * @format
 */
import 'react-native-gesture-handler';
import { registerGlobals } from '@livekit/react-native-webrtc';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Register LiveKit globals for real-time streaming
registerGlobals();

AppRegistry.registerComponent(appName, () => App);
