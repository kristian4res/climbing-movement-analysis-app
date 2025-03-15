import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, FlatList, ScrollView } from 'react-native';
import { Button, Text, Modal, Portal, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { getThumbnailAsync } from 'expo-video-thumbnails';
import PoseDetection from '@/components/PoseDetection';
import InteractiveVideoList from '@/components/lists/InteractiveVideoList';
import * as MediaLibrary from 'expo-media-library';
import { Asset } from 'expo-asset';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/constants/Dimensions';
import { ALBUM_NAME } from '@/constants/Media';
import { generateUniqueId } from '@/common/utils';
import { ThemeContext } from '@/context/themeContext';
import NoDataFound from '@/components/NoDataFound';
import Colors from '@/constants/Colors';

const MAX_VIDEOS = 5;
const LOAD_TEST_VIDEOS = false;

export default function AnalyseScreen() {
    const { isDark } = useContext(ThemeContext);
    const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        videoContainer: {
            flex: 1,
            width: SCREEN_WIDTH
        },
        poseContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: SCREEN_WIDTH
        },
        inputContainer: {
            flex: 0.2
        },
        fixedVideo: {
            height: '50%', 
            width: '100%',
        },
        scrollableThumbnail: {
            flexGrow: 1,
        },
        input: {
            borderWidth: 1,
            marginBottom: 10,
            color: isDark ? 'white' : 'black'
        }, 
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22,
        },
        modalView: {
            margin: 20,
            backgroundColor: isDark ? 'black' : 'white',
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center",
            color: isDark ? 'white' : 'black'
        },
        pickerContainer: {
            width: SCREEN_WIDTH * 0.7,
            rowGap: 8
        },
        detectPoseButton: {
            backgroundColor: isDark ? 'black' : 'white',
            padding: 10,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: isDark ? 'white' : 'black'
        },
        detectPoseButtonText: {
            color: isDark ? 'white' : 'black'
        },
        videoListContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        videoListText: {
            color: isDark ? 'white' : 'black'
        },
        containerWithBackground: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        poseContainerWithBackground: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: SCREEN_WIDTH,
        },
        buttonContainer: {
            flex: 1,
            width: SCREEN_WIDTH,
            justifyContent: 'center',
            alignItems: 'center',
        },
        separator: {
            marginVertical: 30,
            height: 5,
            width: '100%',
            backgroundColor: 'gray'
        },
        modalContainer: {
            backgroundColor: isDark ? 'black' : 'white',
            padding: 20,
            minHeight: SCREEN_HEIGHT * .5,
            gap: 20,
        }
    });

    const [selectedVideo, setSelectedVideo] = useState<string>('');
    const [videos, setVideos] = useState<MediaLibrary.Asset[]>([]);
    const [addedVideos, setAddedVideos] = useState<MediaLibrary.Asset[]>([]);
    
    const [timestamp, setTimestamp] = useState<string>('');
    const [poseImages, setPoseImages] = useState<{imageUri: string, videoUri: string}[] | null>(null);

    const [addVideoModal, setAddVideoModal] = useState(false);
    const [detectPoseModal, setDetectPoseModal] = useState(false);

    const fetchTestVideos = async (): Promise<MediaLibrary.Asset[]> => {
        try {
            const videoAssets = [
                Asset.fromModule(require('@/assets/test_videos/video1.mp4')),
                Asset.fromModule(require('@/assets/test_videos/video2.mp4')),
            ];
    
            const downloadedAssets = await Promise.all(videoAssets.map(asset => asset.downloadAsync()));
            const testAssets: Promise<MediaLibrary.Asset>[] = downloadedAssets.map(async (asset, index) => {
                if (!asset.localUri) {
                    throw new Error(`Asset at index ${index} does not have a localUri`);
                }
    
                const assetRef = await MediaLibrary.createAssetAsync(asset.localUri);
                const assetInfo = await MediaLibrary.getAssetInfoAsync(assetRef);
                const randomId = generateUniqueId();
                const id = `${index}-${randomId}`;
    
                return {
                    id: id || 'no-id',
                    filename: asset.name || 'no-filename',
                    uri: asset.localUri,
                    mediaType: assetInfo.mediaType,
                    mediaSubtypes: assetInfo.mediaSubtypes || [],
                    width: assetInfo.width,
                    height: assetInfo.height,
                    creationTime: assetInfo.creationTime,
                    modificationTime: assetInfo.modificationTime,
                    duration: assetInfo.duration,
                    albumId: assetInfo.albumId,
                };
            });
    
            const assets = await Promise.all(testAssets);
            if (assets.length !== videoAssets.length) {
                throw new Error('Could not get all of the requested assets');
            }
            return assets;
        } catch (error) {
            console.error('Error fetching test videos:', error);
            return [];
        }
    };

    const fetchVideosFromLibrary = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant the permission to access media library');
            return;
        }
    
        const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
        console.log('Retrieving album: ', album);
        if (album && album.assetCount > 0) {
            const { assets } = await MediaLibrary.getAssetsAsync({
                album: album,
                mediaType: 'video',
            });
            return assets;
        }
        return null;
    };

    const findVideoInAlbum = async (filename: string) => {
        const album = await MediaLibrary.getAlbumAsync(LOAD_TEST_VIDEOS ? "test_videos" : ALBUM_NAME);
        const { assets } = await MediaLibrary.getAssetsAsync({
            album: album,
            mediaType: 'video',
        });
        return assets.find(asset => asset.filename === filename);
    };

    const handleSelectedVideo = (filename: string) => {
        Alert.alert(
            "Confirm",
            "Do you want to add this video?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancelled 'Add Video'"),
                    style: "cancel"
                },
                { text: "OK", onPress: async () =>  {
                    addToVideoList(filename);
                    
                    const video = await findVideoInAlbum(filename);
                    if (video) {
                        setSelectedVideo(video.uri);
                    }
                }}
            ]
        );
    };

    const addToVideoList = async (filename: string) => {
        if (!filename) {
            console.log('No filename given');
            return;
        }

        if (addedVideos.find(video => video.filename === filename)) {
            console.log('Video already added');
            return;
        }
        
        if (addedVideos.length === MAX_VIDEOS) {
            console.log(`Reached max limit for added videos: ${MAX_VIDEOS}/${MAX_VIDEOS}`);
            return;
        }    

        const asset = await findVideoInAlbum(filename);

        if (!asset) {
            console.error('Cannot find video')
            return;
        }
        
        setAddedVideos((prevState) => [...prevState, asset]);
        console.log('Added new video to list');
    };

    const extractImage = async () => {
        if (selectedVideo.length === 0) {
            console.log('No URI received');
            return;
        }

        const { uri } = await getThumbnailAsync(selectedVideo, {
            time: Number(timestamp) * 1000,
        });
        setPoseImages(prevState => [...(prevState || []), {imageUri: uri, videoUri: selectedVideo}]);
    };

    const removePoseImage = (uri: string) => {
        if (!poseImages) {
            console.log('No pose images to delete')
            return;
        }
        setPoseImages(prevState => {
            if (prevState) {
                return prevState.filter(uriArr => uriArr.imageUri !== uri)
            }
            return null;
        });
    };

    useEffect(() => {
        const fetchVideos = async () => {
            let fetchedVideos: MediaLibrary.Asset[] | null | undefined;
            if (LOAD_TEST_VIDEOS) {
                const testVideos = await fetchTestVideos();
                if (testVideos) {
                    fetchedVideos = testVideos;
                }
            }
            else {
                const videos = await fetchVideosFromLibrary();
                if (videos) {
                    fetchedVideos = videos;
                }
            }
            if (fetchedVideos) {
                console.log('Fetched videos...');
                setVideos(fetchedVideos);
            }
        }
    
        fetchVideos();
    }, []);

    return (
        <View style={containerStyle}>
            <View style={styles.videoContainer}>
                <View style={styles.videoListContainer}>
                    {
                        addedVideos && addedVideos.length > 0 ? (
                            <InteractiveVideoList videos={addedVideos} setVideos={setAddedVideos} />
                        ) : <Text style={styles.videoListText}>No videos to show</Text>
                    }
                </View>
                <Button mode="contained" onPress={() => setAddVideoModal(true)}>
                    Add Videos
                </Button>
                <Portal>
                    <Modal visible={addVideoModal} onDismiss={() => setAddVideoModal(false)} contentContainerStyle={styles.modalContainer}>
                        <Text style={{ fontSize: 26, color: isDark ? 'white' : 'black', margin: 6 }}>
                            Select video to add
                        </Text>
                        <FlatList
                            style={{ padding: 4 }}
                            data={videos}
                            extraData={{ videos, addVideoModal }} 
                            keyExtractor={(item) => item.id}
                            ListEmptyComponent={() => (
                                <NoDataFound description={'No videos found'} />
                            )}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelectedVideo(item.filename)}>
                                    <Text style={styles.modalText}>{item.filename}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <Button mode="contained" onPress={() => setAddVideoModal(false)}>
                            Close
                        </Button>
                    </Modal>
                </Portal>
            </View>
            <View style={styles.separator}  />
            <View style={styles.poseContainerWithBackground}>
                {
                    poseImages && poseImages.length ? (
                        <FlatList
                            horizontal
                            data={poseImages}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item: uriArr }) => (
                                <ScrollView>
                                    <PoseDetection uri={uriArr} />
                                    <Button mode="contained" onPress={() => removePoseImage(uriArr.imageUri)}>
                                        Remove
                                    </Button>
                                </ScrollView>
                            )}
                        />
                    ) : <Text variant='bodyLarge'>No poses to show</Text>
                }
            </View> 
            <View style={styles.inputContainer}>
                <View style={styles.buttonContainer}>
                    <View style={{ width: SCREEN_WIDTH }}>
                        <Button mode="contained" onPress={() => setDetectPoseModal(true)}>
                            Detect
                        </Button>
                    </View>
                    <Portal>
                        <Modal visible={detectPoseModal} onDismiss={() => setDetectPoseModal(!detectPoseModal)} contentContainerStyle={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                    placeholder='Select a video'
                                    selectedValue={selectedVideo}
                                    onValueChange={(itemValue) => setSelectedVideo(itemValue)}
                                    style={[styles.input, { backgroundColor: isDark ? 'gray' : 'white' }]}
                                    >
                                    {addedVideos.length > 0 ? (
                                        addedVideos.map((video, index) => (
                                        <Picker.Item key={index} label={video.filename} value={video.uri} />
                                        ))
                                    ) : (
                                        <Picker.Item label="No videos available" value="" />
                                    )}
                                    </Picker>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => {
                                            setTimestamp(text);
                                        }}
                                        value={timestamp}
                                        keyboardType='numeric'
                                        placeholder="Enter time in seconds"
                                        placeholderTextColor={isDark ? 'white' : 'black'}
                                    />
                                    <TouchableOpacity 
                                        onPress={() => {
                                            if (timestamp.length == 0) {
                                                console.log('Please enter a number in seconds')
                                                return null;
                                            }
                                            setDetectPoseModal(false);
                                            extractImage();
                                        }} 
                                        style={styles.detectPoseButton}
                                    >
                                        <Text style={styles.detectPoseButtonText}>
                                            Detect Pose
                                        </Text>
                                    </TouchableOpacity>
                                    <Button mode="contained" onPress={() => setDetectPoseModal(false)} >
                                        Close
                                    </Button>
                                </View>
                            </View>
                        </Modal>
                    </Portal>
                </View>
            </View>
        </View>
    );
}