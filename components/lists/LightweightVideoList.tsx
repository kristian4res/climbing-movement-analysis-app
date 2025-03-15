import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { View, Image, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/constants/Dimensions';
import * as MediaLibrary from 'expo-media-library';
import { TouchableVideoListProps } from '@/interfaces';
import { ThemeContext } from '@/context/themeContext';
import NoDataFound from '../NoDataFound';
import Colors from '@/constants/Colors';

export default function LightweightVideoList({ limit }: TouchableVideoListProps) {
    const { isDark } = useContext(ThemeContext);
    const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;
    const [videos, setVideos] = useState<MediaLibrary.Asset[]>([]);
    const [endCursor, setEndCursor] = useState<MediaLibrary.AssetRef>('0'); 
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const insets = useSafeAreaInsets();

    const fetchVideos = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            return;
        }
    
        const album = await MediaLibrary.getAlbumAsync('cma-app');
        if (album && album.assetCount > 0) {
            const { assets, endCursor: newEndCursor, hasNextPage } = await MediaLibrary.getAssetsAsync({
                album: album,
                mediaType: 'video',
                first: limit || 4,
                after: endCursor,
            });
            setVideos(prevVideos => [...prevVideos, ...assets]); 
            setEndCursor(newEndCursor); 
            setHasNextPage(hasNextPage);
        };
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const renderEmptyList = () => (
        <NoDataFound description={'No videos found'} />
    );

    const renderVideo = ({ item: video }: { item: MediaLibrary.Asset }) => (
        <View>
            <Text variant='titleMedium' style={{marginVertical: 10}}>{video.filename}</Text>
            <Link href={{
                pathname: `/climbs/${video.filename}`,
                params: {
                    videoUri: video.uri
                }
            }} asChild>
                <TouchableOpacity activeOpacity={0.5}>
                    <Image source={{ uri: video.uri }} style={{ width: SCREEN_WIDTH, height: 200 }} />
                </TouchableOpacity>
            </Link>
        </View>
    );

    return (
        <View style={{...containerStyle, flex: 0 }}>
            <FlatList
                data={videos}
                renderItem={renderVideo}
                ListEmptyComponent={renderEmptyList}
                keyExtractor={(item) => item.id}
                onEndReachedThreshold={0.5}
                horizontal={true} 
            />
        </View>
    );
}