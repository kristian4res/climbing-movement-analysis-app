import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Text, Button } from 'react-native-paper';
import { View, Image, Alert, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/constants/Dimensions';
import * as MediaLibrary from 'expo-media-library';
import { TouchableVideoListProps } from '@/interfaces';
import NoDataFound from '../NoDataFound';
import { ThemeContext } from '@/context/themeContext';
import Colors from '@/constants/Colors';

export default function TouchableVideoList({ limit }: TouchableVideoListProps) {
    const { isDark } = useContext(ThemeContext);
    const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;
    const [videos, setVideos] = useState<MediaLibrary.Asset[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [endCursor, setEndCursor] = useState<MediaLibrary.AssetRef>('0'); 
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const insets = useSafeAreaInsets();

    const fetchVideos = async () => {
        setIsLoading(true);
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant the permission to access media library');
            return;
        }
    
        const album = await MediaLibrary.getAlbumAsync('cma-app');
        console.log('Retrieving album: ', album);
        if (album && album.assetCount > 0) {
            console.log('End cursor: ', endCursor);
            const { assets, endCursor: newEndCursor, hasNextPage } = await MediaLibrary.getAssetsAsync({
                album: album,
                mediaType: 'video',
                first: limit || 8,
                after: endCursor,
            });
            setVideos(prevVideos => [...prevVideos, ...assets]); 
            setEndCursor(newEndCursor); 
            setHasNextPage(hasNextPage);
        };
        setIsLoading(false);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setVideos([]);
        fetchVideos().then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        fetchVideos();
    }, []);

    const onEndReached = () => {
        if (hasNextPage) {
            fetchVideos();
        }
    };

    const renderVideo = ({ item: video }: { item: MediaLibrary.Asset }) => (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
            <Text variant='titleMedium' style={{marginVertical: 10}}>{video.filename}</Text>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : 
                <Link href={{
                    pathname: `/climbs/${video.filename}`,
                    params: {
                        videoUri: video.uri
                    }
                }} asChild>
                    <TouchableOpacity activeOpacity={0.5}>
                        <Image source={{ uri: video.uri }} style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT / 2.5 }} />
                    </TouchableOpacity>
                </Link>
            }
            <Button
                style={{marginTop: 10}}
                mode='contained'
                onPress={() => {
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
                                    console.log('Deleting video: ', video);
                                    await MediaLibrary.deleteAssetsAsync([video]);
                                    console.log('Deleted video');
                                    fetchVideos();
                                },
                            },
                        ],
                        { cancelable: false },
                    );
                }}
            >
                Delete Video
            </Button>
        </View>
    );

    const renderEmptyList = () => (
        <NoDataFound description={'No videos found'} />
    );

    return (
        <View style={{ paddingBottom: insets.bottom + 50, ...containerStyle }}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={videos}
                    renderItem={renderVideo}
                    keyExtractor={(item) => item.id}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    ListEmptyComponent={renderEmptyList}
                    onEndReached={onEndReached} 
                    onEndReachedThreshold={0.5}
                />
            )}
        </View>
    );
}
