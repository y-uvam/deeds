import { useCallback } from 'react';
import { Platform, Linking, Alert } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';

const openAppSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

const permissionAlert = (message) => {
  Alert.alert(
    'Permission Required',
    message || 'This app needs access to a specific feature.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Open Settings',
        style: 'default',
        onPress: () => {
          openAppSettings();
        },
      },
    ]
  );
};

export const usePermissions = () => {
  const checkAndRequest = useCallback(async (permission, blockMessage) => {
    try {
      const result = await check(permission);

      if (result === RESULTS.UNAVAILABLE) {
        console.log('Feature is not available on this device.');
        return false;
      }

      if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        if (
          requestResult === RESULTS.GRANTED ||
          requestResult === RESULTS.LIMITED
        ) {
          console.log('Permission granted.');
          return true;
        } else if (requestResult === RESULTS.BLOCKED) {
          permissionAlert(blockMessage);
          return false;
        }
        return false;
      }

      if (result === RESULTS.BLOCKED) {
        permissionAlert(blockMessage);
        return false;
      }

      if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
        console.log('Permission already granted.');
        return true;
      }

      return false;
    } catch (err) {
      console.log('Permission error:', err);
      return false;
    }
  }, []);

  const requestCameraPermission = useCallback(async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
    return checkAndRequest(
      permission,
      'Camera permission has been blocked. Please manually give permission in Settings.'
    );
  }, [checkAndRequest]);

  const requestPhotoLibraryPermission = useCallback(async () => {
    let permission;
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
    } else {
      permission =
        Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    }
    return checkAndRequest(
      permission,
      'Photo library permission has been blocked. Please manually give permission in Settings.'
    );
  }, [checkAndRequest]);

  const requestLocationPermission = useCallback(async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    return checkAndRequest(
      permission,
      'Location permission has been blocked. Please manually give permission in Settings.'
    );
  }, [checkAndRequest]);

  const requestMicrophonePermission = useCallback(async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO;
    return checkAndRequest(
      permission,
      'Microphone permission has been blocked. Please manually give permission in Settings.'
    );
  }, [checkAndRequest]);

  const requestNotificationPermission = useCallback(async () => {
    try {
      const { status } = await checkNotifications();

      if (status === RESULTS.UNAVAILABLE) return false;

      if (status === RESULTS.DENIED) {
        const { status: reqStatus } = await requestNotifications([
          'alert',
          'badge',
          'sound',
        ]);
        if (reqStatus === RESULTS.GRANTED || reqStatus === RESULTS.LIMITED) {
          return true;
        }
        if (reqStatus === RESULTS.BLOCKED) {
          permissionAlert(
            'Notification permission has been blocked. Please manually give permission in Settings.'
          );
        }
        return false;
      }

      if (status === RESULTS.BLOCKED) {
        permissionAlert(
          'Notification permission has been blocked. Please manually give permission in Settings.'
        );
        return false;
      }

      if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) return true;

      return false;
    } catch (err) {
      console.log('Notification permission error', err);
      return false;
    }
  }, []);

  return {
    requestCameraPermission,
    requestPhotoLibraryPermission,
    requestLocationPermission,
    requestMicrophonePermission,
    requestNotificationPermission,
  };
};
