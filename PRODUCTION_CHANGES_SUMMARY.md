# Production Build Changes - Summary

## Changes Made ✅

The following files have been updated for production Android build:

### 1. **capacitor.config.ts**
```typescript
// BEFORE:
appId: 'com.example.app'
url: 'http://localhost:3000'
cleartext: true

// AFTER:
appId: 'com.koko.ami'
url: 'https://ami-by-koko.vercel.app'  // TODO: Update if different Vercel URL
cleartext: false
```

**What changed:**
- App ID now matches your unique app identifier
- Server URL points to production Vercel deployment
- HTTPS enforced (cleartext: false)
- Added SplashScreen plugin config

---

### 2. **android/app/build.gradle**
```gradle
// BEFORE:
namespace = "com.example.app"
applicationId "com.example.app"
// No signing config

// AFTER:
namespace = "com.koko.ami"
applicationId "com.koko.ami"
signingConfigs {
    release {
        storeFile file("../ami-by-koko.keystore")
        storePassword System.getenv("KEYSTORE_PASSWORD") ?: ""
        keyAlias System.getenv("KEY_ALIAS") ?: "ami-key"
        keyPassword System.getenv("KEY_PASSWORD") ?: ""
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}
```

**What changed:**
- Updated namespace and applicationId to match your app
- Added release signing configuration (reads env vars for security)
- Release builds now automatically signed

---

### 3. **.env.local**
```env
// BEFORE:
NEXT_PUBLIC_APP_URL=http://localhost:3000

// AFTER:
NEXT_PUBLIC_APP_URL=https://ami-by-koko.vercel.app
```

**What changed:**
- App URL now points to production Vercel URL
- Used for generating links in notifications and redirects

---

## Next Steps ⚠️

### Step 1: Update Vercel URL (if different)
If your Vercel app is deployed to a different URL than `ami-by-koko.vercel.app`, update:
- `capacitor.config.ts` → `server.url`
- `.env.local` → `NEXT_PUBLIC_APP_URL`

Example: If your Vercel URL is `https://my-custom-domain.com`:
```typescript
// capacitor.config.ts
server: {
  url: 'https://my-custom-domain.com',
  cleartext: false
}
```

### Step 2: Generate Keystore (One-time)
Run this ONCE to create your signing key:
```bash
keytool -genkey -v -keystore ami-by-koko.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias ami-key
```

You'll be prompted for passwords and personal details. **Save this keystore file securely** — you'll need it for every app update.

### Step 3: Set Environment Variables Before Building
Every time you build the release APK/AAB, set:
```bash
# Windows PowerShell
$env:KEYSTORE_PASSWORD = "your_keystore_password"
$env:KEY_ALIAS = "ami-key"
$env:KEY_PASSWORD = "your_key_password"
```

### Step 4: Deploy to Vercel
```bash
git add .
git commit -m "Configure production Android build"
git push origin main
# Vercel auto-deploys, OR manually: vercel deploy --prod
```

### Step 5: Build Signed Release Bundle
```bash
# Set env vars first (see Step 3)
npx cap sync android
cd android
./gradlew bundleRelease
cd ..
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Step 6: Upload to Google Play
1. Create app on [play.google.com/console](https://play.google.com/console)
2. Upload `app-release.aab` to Production release
3. Fill store listing
4. Submit for review

---

## Security Notes 🔒

✅ **DO:**
- Keep `.keystore` file secure (not in version control)
- Use environment variables for keystore password
- Use Vercel environment variables for Supabase/Paystack keys
- Enable 2FA on Google Play account

❌ **DON'T:**
- Commit `.keystore` to git
- Hardcode passwords in build.gradle
- Use `cleartext: true` in production
- Expose `SUPABASE_SERVICE_ROLE_KEY` to browser

---

## Verification Checklist

Before building for release:

- [ ] Verify Vercel deployment is live: `https://ami-by-koko.vercel.app` (or your URL)
- [ ] Check environment variables are set on Vercel dashboard
- [ ] Confirm `capacitor.config.ts` points to correct Vercel URL
- [ ] Confirm `.env.local` points to correct Vercel URL
- [ ] `.keystore` file created and stored safely
- [ ] `build.gradle` has app ID `com.koko.ami`
- [ ] Version code/name updated in `build.gradle` if re-releasing

---

## Files Modified

1. ✅ `capacitor.config.ts` — Production server config
2. ✅ `android/app/build.gradle` — App ID, signing config
3. ✅ `.env.local` — Production app URL

## Files NOT Modified (Do these manually on Vercel Dashboard)

- Vercel environment variables (set on vercel.com, not in repo)
- Google Play Store secrets (handled by Google)

---

## Quick Command Reference

```bash
# Local development (still works)
npm run dev

# Build for production
npm run build

# Sync Capacitor
npx cap sync android

# Build signed AAB (requires env vars set)
cd android && ./gradlew bundleRelease && cd ..

# Build signed APK (alternative)
cd android && ./gradlew assembleRelease && cd ..
```

---

**Status**: ✅ Code changes complete. Ready for next step: Generate keystore & build.
