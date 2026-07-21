/**
 * @format
 */
import "react-native-gesture-handler";
import { AppRegistry, View } from "react-native";

// Polyfill for deprecated prop types (needed by react-native-snap-carousel in RN 0.71+)
// This mocks View.propTypes without installing any additional libraries.
if (!View.propTypes) {
  View.propTypes = { style: {} };
}
import App from "./App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
