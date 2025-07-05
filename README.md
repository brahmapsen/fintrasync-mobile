# Personal Finanancial Wizard

# EXPO https://expo.dev

## Check out the repo
npm install  | npm install --legacy-peer-deps
npx expo install --check  [to install updated version]  | npx expo install --fix
npx expo-doctor
npx expo start

# EAS
# Make sure eas-cli installed globally: 
sudo npm install -g eas-cli
eas --version [eas-cli/16.10.0 linux-x64 node-v18.19.1]

# EAS commands
eas login
eas init
eas build:configure  | eas update:configure
npx expo export --platform web [web bundle created]
eas deploy --prod  [fintra.expo.app]

# Application Link:
https://fintra.expo.app

# IOS deployment Apple Developer: https://developer.apple.com

eas build -s

# Android Build - Google play account: https://play.google.com

eas build -p android


## Install EXPO GO in IPhone
eas update --branch production --message "Initial update"

## Expo GO was set for development build
npm uninstall expo-dev-client

