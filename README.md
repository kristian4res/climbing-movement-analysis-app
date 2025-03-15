# Climbing Movement Analysis (CMA) App 🧗

A React Native application that allows you to analyse your movements through pose estimation. This was produced as part of a research project for university.

**Note:** The following app screenshots show the final iteration of the CMA app, so you may not see the same UI unless it's the final version.
![alt text](screenshots/app-screenshot.jpg)

# Setup ⚙️

#### Apart from the source code, to host the app, ensure you

- Have a PC and mobile device (a physical device is necessary
as the app uses a camera)
  - The PC will be used to host the app and to preview the app on the phone (via Expo Go), they need to be in the same network.  
  - **Note:** This app was primarily developed on Android phones and may not work as intented on iOS devices.
- Install [Node LTS](https://nodejs.org/en/download)
  - **Note:** I used Node v21.x.x. Older versions may not be compatible.
- [npm](https://www.npmjs.com/) or [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
  - **Note:** If you've installed Node, npm should have been installed by default. npm and yarn are essentially the same but yarn provides some quality of life benefits that make it easier to deal with dependency compatibility issues.

#### To preview and use the app, ensure you

- Install the Expo Go app (SDK 50) through the [official site](https://expo.dev/go)
  - **Note:** This app specifically works for version 50 of the Expo SDK, so to compile and preview the app in Expo Go. As of May 7th 2024, [version 51](https://expo.dev/changelog/2024/05-07-sdk-51) was released and so the newest Expo Go in the App Store or Google Play will only support version 51 by default, which is not compatible with the app.  

# Usage 📱

#### To run the application

1) In your PC, start the expo server for hosting the app by running one of the following commands in a terminal:

```
# using npm
npm install && npm start -c
# using yarn
yarn install && yarn start -c
```

2) Open the Expo Go on your phone and scan the QR code or manually enter the URL shown in the terminal to connect to the application (see example below). **Note:** Ensure your device is connected to the same network as the PC.

#### Example

![alt text](screenshots/example-expo-terminal.png)
