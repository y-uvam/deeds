import { useCallback } from "react";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const useHaptics = () => {
  const haptics = useCallback((type = "impactLight") => {
    console.log("Triggering haptic feedback:", type);
    ReactNativeHapticFeedback.trigger(type, options);
  }, []);

  return haptics;
};
