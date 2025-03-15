import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Text, IconButton, Tooltip, useTheme } from 'react-native-paper';
import { View, Dimensions, Alert, Linking, PermissionsAndroid } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { formatTime } from '@/common/utils';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/constants/Dimensions';
import NoCameraFound from '../assets/images/camera.svg';
import Colors from '@/constants/Colors';
import { ThemeContext } from '@/context/themeContext';
import PulsingCircle from './PulsingCircle';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Haptics from 'expo-haptics';

export default function CameraView() {
    const { isDark } = useContext(ThemeContext);
    const theme = useTheme();
    const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [zoom, setZoom] = useState<number>(0);
    const scaleRef = useRef(1);
    const cameraRef = useRef<Camera>(null);
    const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
    const [recordingTime, setRecordingTime] = useState<number>(0);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [showGrid, setShowGrid] = useState<boolean>(false); 
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
        Dimensions.get('window').width < Dimensions.get('window').height ? 'portrait' : 'landscape'
    );

    // useEffect(() => {
    //     ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.ALL);

    //     const subscription = ScreenOrientation.addOrientationChangeListener(({ orientationInfo: { orientation } }) => {
    //         setOrientation(
    //             orientation === ScreenOrientation.Orientation.PORTRAIT_UP || orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN ? 'portrait' : 'landscape'
    //         );
    //     });

    //     return () => {
    //         ScreenOrientation.removeOrientationChangeListener(subscription);
    //     };
    // }, []);
    
    const toggleGrid = () => {
        setShowGrid(prevShowGrid => !prevShowGrid);
    };

    useEffect(() => {
        (async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
            const { status: mediaLibStatus } = await MediaLibrary.requestPermissionsAsync();
            const { status: mediaLibWriteStatus } = await MediaLibrary.getPermissionsAsync();
            
            const readStoragePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
            const writeStoragePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    
            setHasPermission(cameraStatus === 'granted' && audioStatus === 'granted' && mediaLibStatus === 'granted' && mediaLibWriteStatus === 'granted' && writeStoragePermission && readStoragePermission);
        })();
    }, []);

    const toggleCameraType = () => {
        setCameraType(prevCameraType => 
        prevCameraType === CameraType.back
            ? CameraType.front
            : CameraType.back
        );
    };
    
    const toggleRecording = async () => {
        if (!cameraRef.current) {
            console.log('No camera detected for recording video');
            return;
        }
        if (isRecording) {
            setIsRecording(false);
            await cameraRef.current.stopRecording();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            console.log('Recording stopped...');

            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
                recordingIntervalRef.current = null;
            }
        } else {
            setIsRecording(true);
            setRecordingTime(0);
            Haptics.selectionAsync();
            console.log('Recording started...');
            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime(prevTime => prevTime + 1);
            }, 1000);
    
            try {
                const video = await cameraRef.current.recordAsync();
                console.log('Recording finished');
                
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status !== 'granted') {
                    console.error('MediaLibrary permission not granted');
                    Alert.alert(
                        'Permission required',
                        'This app needs access to your media library to save videos.',
                        [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                        ],
                    );
                        return;
                }
    
                const asset = await MediaLibrary.createAssetAsync(video.uri);
                console.log('Asset: ', asset)
                const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
                console.log('Asset local URI: ', assetInfo.uri);
                Alert.alert(
                    'Video Saved',
                    `The video has been saved with the filename: ${asset.filename}`,
                    [
                        {
                            text: 'OK',
                        },
                    ],
                );

                let album = await MediaLibrary.getAlbumAsync('cma-app');
                if (album === null) {
                    console.log('No cma-app album found');
                    album = await MediaLibrary.createAlbumAsync('cma-app', asset);
                    console.log('Creating album: ', album);
                } else {
                    await MediaLibrary.addAssetsToAlbumAsync([asset], album);
                    console.log('Video saved: ', album);
                }
            } 
            catch (error) {
                console.error('Error saving video: ', error);
            }
        }
    };

    const onZoomEvent = useCallback((event: { nativeEvent: { scale: any; }; }) => {
        let scale = event.nativeEvent.scale;
        if (scale < 1) {
            scale = 0;
        } else if (scale > 1) {
            scale = (scale - 1) / 1.5 + scaleRef.current;
            if (scale > 1) {
            scale = 1;
            }
        }
        setZoom(scale);
    }, []);

    const onZoomStateChange = useCallback((event: { nativeEvent: { oldState: number; }; }) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            scaleRef.current = zoom;
        }
    }, [zoom]);
    
    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return (
            <View style={{ padding: 20, ...containerStyle }}>
                <NoCameraFound width={100} height={100} />
                <Text style={{ fontSize: 16, marginTop: 5 }}>
                    No access to camera. Please provide permissions by going to your settings. 
                </Text>
            </View>
        )
    }

    return (
        <View style={containerStyle}>
            <PulsingCircle isActive={isRecording} />
            <PinchGestureHandler
                onGestureEvent={onZoomEvent}
                onHandlerStateChange={onZoomStateChange}
            >
                <Camera style={{ flex: 1, width: SCREEN_WIDTH }} type={cameraType} zoom={zoom} ref={cameraRef}/>
            </PinchGestureHandler>
            {
                showGrid && (
                    <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'transparent' }}>
                        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: 'transparent' }}>
                            <View style={{ flex: 1, borderRightWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)', backgroundColor: 'transparent' }} />
                            <View style={{ flex: 1, borderRightWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)', backgroundColor: 'transparent' }} />
                            <View style={{ flex: 1, backgroundColor: 'transparent' }} />
                        </View>
                        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, flexDirection: 'column', backgroundColor: 'transparent' }}>
                            <View style={{ flex: 1, borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)', backgroundColor: 'transparent' }} />
                            <View style={{ flex: 1, borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)', backgroundColor: 'transparent' }} />
                            <View style={{ flex: 1, backgroundColor: 'transparent' }} />
                        </View>
                    </View>
                )
            }
            <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                position: 'absolute', 
                top: 10, 
                left: 10, 
                right: 10, 
            }}>
                <Text style={{
                    position: 'absolute',
                    top: orientation === 'portrait' ? 10 : 0,
                    left: orientation === 'portrait' ? 10 : 0,
                    right: orientation === 'landscape' ? 10 : undefined,
                    color: 'white',
                    fontSize: 18
                }}>
                    Zoom: {Math.round(zoom * 100)}%
                </Text>
                <Text style={{
                    position: 'absolute',
                    top: orientation === 'portrait' ? 10 : 0,
                    right: orientation === 'portrait' ? 10 : 0,
                    left: orientation === 'landscape' ? 10 : undefined,
                    color: 'white',
                    fontSize: 18
                }}>
                    {isRecording ? formatTime(recordingTime) : ''}
                </Text>
            </View>
            <View style={{ 
                flexDirection: orientation === 'portrait' ? 'row' : 'column', 
                position: 'absolute', 
                bottom: orientation === 'portrait' ? 0 : '33%', 
                transform: [{ 
                    translateX: orientation === 'portrait' ? 0 : SCREEN_HEIGHT - 600
                }],
            }}>
                <View style={{ width: SCREEN_WIDTH, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .3)' }}>
                    <Tooltip title='Flip camera'>
                        <IconButton
                            icon={"camera-flip-outline"}
                            size={36}
                            iconColor={theme.colors.onPrimary}
                            onPress={toggleCameraType}
                        />
                    </Tooltip>
                    <Tooltip title={isRecording ? "Stop recording" : "Start recording"}>
                        <IconButton
                            icon={isRecording ? "close-circle" : "circle-slice-8"}
                            size={72}
                            iconColor={isRecording ? theme.colors.error : theme.colors.onPrimary}
                            onPress={toggleRecording}
                        />
                    </Tooltip>
                    <Tooltip title={showGrid ? 'Hide Grid' : 'Show Grid'}>
                        <IconButton
                            icon={"grid"}
                            size={36}
                            iconColor={showGrid ? theme.colors.primary : theme.colors.onPrimary}
                            onPress={toggleGrid}
                        />
                    </Tooltip>
                </View>
            </View>
        </View>
    )
}