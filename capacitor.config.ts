import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.koko.ami',
  appName: 'Àmì by Kòkò',
  webDir: '.next/standalone/public',
  server: {
    url: 'https://amibykoko.app',  // TODO: Update to your production URL
    cleartext: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
