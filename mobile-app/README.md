# Tracebook Android app

This folder contains the Capacitor Android wrapper and the build setup. It uses the website source files in the repository root, so the web app and mobile build stay in step.

The GitHub Actions workflow builds the app on pushes to the `mobile-application` branch and also supports manual runs. Download the `tracebook-android-debug` artifact ZIP from a successful run, extract `app-debug.apk`, and install it on an Android device.

The app uses `https://localhost` as its Android WebView origin. To enable R2 sync inside the APK, deploy the Worker config with that origin included in `ALLOWED_ORIGIN`:

```sh
cd sync-worker
npm install
cf deploy --secrets-file .secrets.json
```

This produces a debug APK for direct installation. A Play Store release needs release signing.
