import { ThemeContext } from '@/context/themeContext';
import { Stack } from 'expo-router';
import { useContext } from 'react';
import Colors from '@/constants/Colors';

const AppStack = () => {
    const { isDark } = useContext(ThemeContext);
    const backgroundStyle = isDark ? Colors.darkBackground : Colors.lightBackground;

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="climbs/[climb]" options={{ headerTitle: "Climb" }} />
            <Stack.Screen name="guides/howTos/[howTos]" options={{ headerShown: true, headerTitle: 'User Guides' }} />
            <Stack.Screen name="guides/metrics/[metric]" options={{ headerShown: true, headerTitle: 'Metrics' }} />
            <Stack.Screen name="info-modal" options={{ headerTitle: "", presentation: "modal" }} />
            <Stack.Screen name="account-settings" options={{ headerTitle: "Account Settings", presentation: "modal" }} />
            <Stack.Screen name="sign-in" options={{ headerShown: false }} />
            <Stack.Screen name="sign-up" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
    );
};

export default AppStack;