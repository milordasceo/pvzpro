import type { ConfigContext, ExpoConfig } from '@expo/config';

const APP_NAME = 'WB ПВЗ';
const BUNDLE_ID = process.env.APP_BUNDLE_ID ?? 'com.wbpvz';
const PACKAGE_ID = process.env.APP_ANDROID_PACKAGE ?? 'com.wbpvz.app';
const VERSION = process.env.APP_VERSION ?? '1.0.0';
const BUILD_NUMBER_IOS = process.env.APP_BUILD_NUMBER_IOS ?? '1.0.0';
const VERSION_CODE_ANDROID = Number(process.env.APP_VERSION_CODE_ANDROID ?? '1');

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: APP_NAME,
  slug: 'wb-pvz',
  version: VERSION,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: `${BUNDLE_ID}.app`,
    buildNumber: BUILD_NUMBER_IOS,
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'Приложению нужен доступ к вашей геопозиции для подтверждения присутствия в ПВЗ при начале смены.',
      NSCameraUsageDescription:
        'Камера используется для сканирования QR-кодов привязки ноутбука и входа в смену.',
    },
  },
  android: {
    package: PACKAGE_ID,
    versionCode: VERSION_CODE_ANDROID,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    permissions: [
      'android.permission.CAMERA',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
    ],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: ['expo-notifications'],
  extra: {
    eas: {
      projectId: 'wb_app',
    },
    apiUrl: process.env.APP_API_URL ?? 'https://api.wb-pvz.ru',
    environment: process.env.APP_ENV ?? 'development',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: process.env.APP_UPDATES_URL,
  },
});
