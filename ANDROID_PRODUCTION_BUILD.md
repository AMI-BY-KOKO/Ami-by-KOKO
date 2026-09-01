# Android Production Build Guide

## Overview
This guide covers building Àmì by Kòkò for production on Android using Capacitor + Next.js on Vercel.

## Architecture
- **Backend**: Next.js app deployed on Vercel
- **Mobile**: Android app via Capacitor connecting to Vercel backend
- **Database**: Supabase (already configured)
- **Payments**: Paystack (already configured)

---

## Phase 1: Prepare Vercel Deployment

### 1.1 Ensure Production Environment Variables are Set on Vercel

Login to [vercel.com](https://vercel.com) and set these on your Ami project:

**Public variables (shown in browser):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `NEXT_PUBLIC_APP_URL` = `https://ami-by-koko.vercel.app` (or your custom domain)

**Secret variables (server-side only):**
- `SUPABASE_SERVICE_ROLE_KEY`
- `PAYSTACK_SECRET_KEY`
- `RESEND_API_KEY` (optional, for broadcasts)
- `WHATSAPP_PHONE_NUMBER_ID` (optional)
- `WHATSAPP_ACCESS_TOKEN` (optional)
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN` (optional)

### 1.2 Deploy to Vercel
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for production Android build"

# Deploy to Vercel
vercel deploy --prod

# Or push to main branch (if Vercel is connected to GitHub)
git push origin main
```

Verify deployment at your production URL (e.g., `https://ami-by-koko.vercel.app`).

---

## Phase 2: Update Capacitor Configuration

### 2.1 Update Capacitor Config for Production

Edit `capacitor.config.ts`:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.koko.ami',  // CHANGE: Use your actual app ID
  appName: 'Àmì by Kòkò',
  webDir: 'public',  // Static web assets (if bundling)
  server: {
    url: 'https://ami-by-koko.vercel.app',  // CHANGE: Use your production URL
    cleartext: false  // CHANGE: Set to false for HTTPS
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
```

### 2.2 Commit Changes
```bash
git add capacitor.config.ts
git commit -m "Update Capacitor config for production"
```

---

## Phase 3: Sign Your Android App

### 3.1 Create a Keystore (First time only)
```bash
# Generate a signing key
keytool -genkey -v -keystore ami-by-koko.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias ami-key

# You'll be prompted for:
# - Keystore password (remember this!)
# - Key password (can be same as keystore)
# - Other details (name, organization, etc.)
```

**Store this keystore securely** (not in version control). This is needed every time you release an update.

### 3.2 Update Build Gradle to Sign Automatically

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("../ami-by-koko.keystore")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
    ...
}
```

---

## Phase 4: Build Release APK/AAB

### 4.1 Build Android App Bundle (Recommended for Play Store)

```bash
# Set environment variables (Windows PowerShell)
$env:KEYSTORE_PASSWORD = "your_keystore_password"
$env:KEY_ALIAS = "ami-key"
$env:KEY_PASSWORD = "your_key_password"

# Sync latest changes
npx cap sync android

# Build signed AAB (App Bundle - required for Google Play Store)
cd android
./gradlew bundleRelease
cd ..
```

The signed AAB will be at: `android/app/build/outputs/bundle/release/app-release.aab`

### 4.2 Alternative: Build Signed APK (for direct distribution)

```bash
$env:KEYSTORE_PASSWORD = "your_keystore_password"
$env:KEY_ALIAS = "ami-key"
$env:KEY_PASSWORD = "your_key_password"

cd android
./gradlew assembleRelease
cd ..
```

The signed APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

---

## Phase 5: Google Play Store Release

### 5.1 Create Google Play Developer Account
1. Go to [play.google.com/console](https://play.google.com/console)
2. Create a new app: "Àmì by Kòkò"
3. Set category: Education
4. Set target audience: Children (ages 3-8)

### 5.2 Upload Signed Bundle
1. Go to **Release** → **Production**
2. Create a new release
3. Upload the signed AAB file (`app-release.aab`)
4. Fill out store listing:
   - Title: "Àmì by Kòkò"
   - Description: Your app description
   - Screenshots (phone, tablet)
   - Icon, Feature graphic, etc.
5. Add privacy policy URL
6. Add content rating (ESRB / PEGI)
7. Submit for review

**Review typically takes 2-4 hours for Google Play.**

---

## Phase 6: Update After Launch

### 6.1 For Bug Fixes
```bash
# Make changes to Next.js code
git add .
git commit -m "Bug fix: ..."

# Deploy to Vercel
vercel deploy --prod
# OR push to main: git push origin main

# No Android app rebuild needed - it auto-fetches latest from Vercel
```

### 6.2 For New Android Release
```bash
# Update version in android/app/build.gradle
# versionCode: increment by 1
# versionName: "1.0.1" (semantic versioning)

# Rebuild signed AAB
npx cap sync android
cd android
./gradlew bundleRelease
cd ..

# Upload new AAB to Google Play Console → Release → Production → Create New Release
```

---

## Security Checklist

- [ ] Never commit `.keystore` file to version control
- [ ] Store keystore password securely (1Password, vault, etc.)
- [ ] All Supabase keys are environment variables (not hardcoded)
- [ ] Paystack live keys set on Vercel
- [ ] `cleartext: false` in `capacitor.config.ts` (HTTPS only in production)
- [ ] Google Play account has 2FA enabled
- [ ] Privacy policy URL is accessible
- [ ] No debug logs in production builds

---

## Troubleshooting

### App Fails to Connect to Backend
- Check `capacitor.config.ts` has correct `server.url`
- Verify Vercel deployment is live
- Check browser console for CORS errors (update Vercel CORS if needed)

### Build Fails with Gradle Error
- Run `./gradlew clean` in `android/` directory
- Delete `.gradle` folder
- Re-sync: `npx cap sync android`

### App Crashes on Android Device
- Check Android Studio logcat for errors
- Verify environment variables are loaded
- Test web version first: `npm run dev` locally

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Update Capacitor config
3. ✅ Generate keystore
4. ✅ Build signed AAB
5. ✅ Create Google Play account
6. ✅ Submit for review
7. ✅ Monitor launch day (check crashes, ratings, feedback)

**Estimated time**: 2-3 hours to first release
