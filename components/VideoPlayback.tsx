import React, { useState, useEffect, useContext } from 'react';
import { Video, ResizeMode } from 'expo-av';
import { Alert, View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { SCREEN_WIDTH } from '@/constants/Dimensions';
import { ThemeContext } from '@/context/themeContext';
import Colors from '@/constants/Colors';

export default function VideoPlayback({ children, filename }: { children?: React.JSX.Element, filename: string }) {
    const { isDark } = useContext(ThemeContext);
    const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [videoUri, setVideoUri] = useState<string | null>(null);

    const fetchVideoUri = async () => {
        if (!filename) {
            console.log('No filename provided');
            return;
        }
        
        const album = await MediaLibrary.getAlbumAsync('cma-app');
        if (!album) {
            console.log('Album not found');
            return;
        }
        
        const { assets } = await MediaLibrary.getAssetsAsync({
            mediaType: 'video',
            album: album,
        });
        const videoAsset = assets.find(asset => {
            return asset.filename === filename
        });

        if (videoAsset) {
            setVideoUri(videoAsset.uri);
            setVideoLoaded(true);
        } else {
            console.log('Could not find video: ', filename);
            return;
        }
    };

    useEffect(() => {
        fetchVideoUri();
    }, [filename]);

    return (
        <View style={{...containerStyle, justifyContent: 'flex-start'}}>
            <Text style={styles.filename}>{filename}</Text>
            {videoLoaded ? (
                <View style={styles.videoContainer}>
                    <Video
                        source={{ uri: videoUri ? videoUri : '' }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode={ResizeMode.COVER}
                        isLooping={false}
                        useNativeControls
                        style={styles.video}
                        onError={(e) => console.log('Error with displaying video: ', e)} 
                    />
                    {
                        children ? children 
                        : 
                        <Button
                            onPress={() => {
                                if (!videoUri) {
                                    console.log('No video URI available');
                                    return;
                                }
                                Alert.alert(
                                    'Delete Video',
                                    'Are you sure you want to delete this video?',
                                    [
                                        {
                                            text: 'Cancel',
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'OK',
                                            onPress: async () => {
                                                try {
                                                    const album = await MediaLibrary.getAlbumAsync('cma-app');
                                                    if (!album) {
                                                        console.log('Album not found');
                                                        return;
                                                    }
                                                    const assets = await MediaLibrary.getAssetsAsync({
                                                        album: album,
                                                        first: 1,
                                                        mediaType: 'video',
                                                        sortBy: 'creationTime',
                                                    });
                                                    const asset = assets.assets.find(a => a.uri === videoUri);
                                                    if (!asset) {
                                                        console.log('Asset not found');
                                                        return;
                                                    }
                                                    console.log('Deleting video: ', asset);
                                                    await MediaLibrary.deleteAssetsAsync([asset.id]);
                                                    console.log('Deleted video');
                                                    router.replace('/(tabs)/climbs');
                                                } catch (error) {
                                                    console.log('Error: ', error)
                                                }
                                            },
                                        },
                                    ],
                                    { cancelable: false },
                                );
                            }}
                        >
                            Delete Video
                        </Button>
                    }
                </View>
            ) : (
                <Text style={styles.noVideoText}>No video to display</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    filename: {
        color: 'white',
        fontSize: 16,
    },
    videoContainer: {
        flex: 1,
    },
    video: {
        flex: 0.9,
        width: SCREEN_WIDTH,
    },
    noVideoText: {
        color: 'white',
        fontSize: 16,
    },
});