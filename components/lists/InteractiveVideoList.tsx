import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { ResizeMode, Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { SCREEN_WIDTH } from '@/constants/Dimensions';
import { InteractiveVideoListProps } from '@/interfaces';
import { ThemeContext } from '@/context/themeContext';
import Colors from '@/constants/Colors';

export default function InteractiveVideoList({ videos, setVideos }: InteractiveVideoListProps) {
    const [loading, setLoading] = useState(false);
    const { isDark } = useContext(ThemeContext);
    const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;

    const removeVideo = (filename: string) => {
        setLoading(false);
        setVideos(videos.filter((video: MediaLibrary.Asset) => video.filename !== filename));
        console.log('Removed video from video list: ', filename);
        setLoading(false);
    };

    const renderItem = ({ item: video }: { item: MediaLibrary.Asset }) => (
        <View style={containerStyle}>
            <Text variant='titleMedium'>{video.filename}</Text>
            <Video
                source={{ uri: video.uri }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                isLooping
                useNativeControls
                style={styles.video}
                onError={(e) => console.log('Error with displaying video: ', e)}
            />
            <Button mode='contained' onPress={() => removeVideo(video.filename)} >
                Remove
            </Button>
        </View>
    );

    return (
        <>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={videos}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH
    },
    video: {
        flex: 1,
        width: SCREEN_WIDTH
    }
});