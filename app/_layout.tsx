import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SessionProvider } from '@/context/authContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, MD3DarkTheme, PaperProvider } from 'react-native-paper';
import LightTheme from '../assets/themes/light.json';
import DarkTheme from '../assets/themes/dark.json';
import { ThemeContext } from '@/context/themeContext';
import AppStack from '@/components/navigation/AppStack';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  const theme = isDark ? {...MD3DarkTheme, colors: {...DarkTheme.colors}} : {...DefaultTheme, colors:  {...LightTheme.colors}};

  return (
    <SessionProvider>
      <SafeAreaProvider>
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            <PaperProvider theme={theme}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <AppStack />
              </GestureHandlerRootView>
            </PaperProvider>
        </ThemeContext.Provider>
      </SafeAreaProvider>
    </SessionProvider>
  );
}
