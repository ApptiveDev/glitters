import 'dotenv/config';

export default {
  expo: {
    name: '반짝이맵',
    slug: 'banjjak',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'me.banjjak.Banjjak',
      infoPlist: {
        UIDeviceFamily: [1],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_API_KEY,
        },
      },
      package: 'me.banjjak.Banjjak',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      googleApiKey: process.env.GOOGLE_API_KEY,
      eas: {
        projectId: 'f796a915-b2db-443b-b933-83ebbf3720f2',
      },
    },
  },
};

