import React from 'react';
import { router } from 'expo-router';
import { Image } from 'react-native';
import { OnboardFlow } from 'react-native-onboard';
import { useTheme } from 'react-native-paper';

export default function OnboardingFlow() {
    const theme = useTheme();

    return (
        <OnboardFlow
            pages={[
                {
                    title: 'Welcome to Climbing Movement Analyser',
                    subtitle: 'A computer vision powered app that analyses your climbing videos to help you understand and improve your climbing.',
                    imageUri: Image.resolveAssetSource(require('@/assets/images/workout-png.png')).uri,
                    primaryButtonTitle: '',
                },
                {
                    title: 'Record',
                    subtitle: 'Record your climbing attempts using the built-in recording functionality.',
                    imageUri: Image.resolveAssetSource(require('@/assets/images/camera-b.png')).uri,
                    primaryButtonTitle: '',
                },
                {
                    title: 'Analyse',
                    subtitle: 'Analyse your climbing videos and extract insights regarding your movement and positioning.',
                    imageUri: Image.resolveAssetSource(require('@/assets/images/fitness-stat.png')).uri,
                    primaryButtonTitle: '',
                },
                {
                    title: 'Review',
                    subtitle: 'Review your past recordings conveniently within the app.',
                    imageUri: Image.resolveAssetSource(require('@/assets/images/organize-photos.png')).uri,
                    primaryButtonTitle: '',
                },
                {
                    title: 'Get Started',
                    subtitle: 'One step away to improving your climbing!',
                    imageUri: Image.resolveAssetSource(require('@/assets/images/runner-start.png')).uri,
                    primaryButtonTitle: 'Get Started',
                }
            ]}
            type={'fullscreen'}
            primaryButtonStyle={{ backgroundColor: theme.colors.primary }}
            onDone={() => router.replace('/sign-in')}
        />
    );
}