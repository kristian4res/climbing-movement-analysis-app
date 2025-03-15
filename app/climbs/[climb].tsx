import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import VideoPlayback from '@/components/VideoPlayback';

export default function ClimbVideoScreen() {
    const { climb: filename } = useLocalSearchParams<{ climb: string }>();

    return (
        <View style={styles.container}>
            <View style={styles.videoContainer}>
                <VideoPlayback filename={filename} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoContainer: {
        flex: 1
    },
});