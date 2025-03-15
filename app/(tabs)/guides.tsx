import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import React, { useContext } from 'react';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/constants/Dimensions';
import { router } from 'expo-router';
import { ThemeContext } from '@/context/themeContext';
import Colors from '@/constants/Colors';

export default function GuidesScreen() {
    const { isDark } = useContext(ThemeContext);
    const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;

    const handleUserGuides = (guide: string) => {
        router.push(`/guides/howTos/${guide}`);
    };

    const handleMetricDetails = (metric: string) => {
        router.push(`/guides/metrics/${metric}`);
    };
    
    return (
        <View style={{...containerStyle, padding: 20 }}>
            <Text variant='headlineLarge' style={styles.title}>Guides</Text>
            <Text style={styles.text}>
                Find user guides and guides to understand your climbing!
            </Text>
            <Text variant='headlineMedium' style={styles.subtitle}>User Guides</Text>
            <Button
                style={styles.button}
                mode="contained" onPress={() => handleUserGuides('how-to-record-and-analyse-a-climbing-video')}
            >
                How to Record and Analyse a Climbing Video
            </Button>
            <View style={styles.separator} />
            <Text variant='headlineMedium' style={styles.subtitle}>Metrics</Text>
            <Button
                style={styles.button}
                mode="contained" onPress={() => handleMetricDetails('elbowAngles')}
            >
                Elbow Flexion/Extension Angles
            </Button>
            <Button
                style={styles.button}
                mode="contained" onPress={() => handleMetricDetails('armpitAngles')}
            >
                Armpit Angles
            </Button>
            <Button
                style={styles.button}
                mode="contained" onPress={() => handleMetricDetails('legSeparationAngle')}
            >
                Leg Separation Angles
            </Button>
            <Button
                style={styles.button}
                mode="contained" onPress={() => handleMetricDetails('kneeAngles')}
            >
                Knee Flexion/Extension Angles
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        justifyContent: 'center',
        marginVertical: 10,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontWeight: '600',
        marginBottom: 15,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    image: {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_HEIGHT * 0.4,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    guideText: {
        fontSize: 16,
        lineHeight: 24,
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    listHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    listItem: {
        fontSize: 16,
        color: '#999',
        lineHeight: 24,
        marginBottom: 10,
        paddingHorizontal: 15,
    },
});