import React, { useContext, useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import { Canvas, Points, vec, useImage, Image as SkiaImage, Blur, Text as SkiaText, useFont } from '@shopify/react-native-skia';
import { View, ActivityIndicator, ScrollView, useColorScheme } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/constants/Dimensions';
import { BodyAngles } from '@/interfaces/poseDetection';
import { calculateCentreOfMass, calculateLegSeparationAngle, calculateLeftAndRightAnglesBetweenKeypoints, calculateArmpitAngles } from '@/common/poseDetection';
import { MIN_KEYPOINT_SCORE } from '@/constants/PoseDetection';
import { ThemeContext } from '@/context/themeContext';
import { Text } from 'react-native-paper';
import Colors from '@/constants/Colors';


const PoseDetection = ({ uri }: { uri: { imageUri: string, videoUri: string } }) => {
    const LOAD_MODEL_FROM_BUNDLE = false;
    const TARGET_IMAGE_HEIGHT = SCREEN_HEIGHT;
    const TARGET_IMAGE_WIDTH = SCREEN_WIDTH;
    const { isDark } = useContext(ThemeContext);
    const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;
    
    const modelRef = useRef<posedetection.PoseDetector | null>(null);
    const image = useImage(uri.imageUri);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [poses, setPoses] = useState<posedetection.Pose[]>([]);
    const [keypointsWithinThreshold, setKeypointsWithinThreshold] = useState<posedetection.Keypoint[]>([]);
    const [bodyAngles, setBodyAngles] = useState<BodyAngles | null>(null);

    /**
     * Predicts the pose from an image using TensorFlow.js and the MoveNet model.
     *
     * @param {string} imageUri - The URI of the image to predict the pose from.
     * @returns {Promise<posedetection.Pose[]>} - A promise that resolves to an array of poses detected in the image.
     * @throws Will throw an error if the pose detection fails.
     */
    const predictPose = async (imageUri: string) => {
        try {
            // Ensure TensorFlow.js is ready
            await tf.ready();
        
            // Configure the model

            // MoveNet
            // const detectorConfig: posedetection.MoveNetModelConfig = {
            //     modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
            //     enableSmoothing: true,
            // };
            

            // PoseNet
            // const detectorConfig: posedetection.ModelConfig = {
            //     runtime: 'tfjs',
            //     enableSmoothing: true,
            // };

            // BlazePose
            const detectorConfig: posedetection.ModelConfig = {
                modelType: 'lite',
                runtime: 'tfjs',
                enableSmoothing: true,
            };
            
            // Create the detector
            modelRef.current = await posedetection.createDetector(
                posedetection.SupportedModels.BlazePose,
                detectorConfig
            );

            // Load the image
            const response = await fetch(imageUri);
            const imageDataArrayBuffer = await response.arrayBuffer();
            const imageData = new Uint8Array(imageDataArrayBuffer);
            const imageTensor = decodeJpeg(imageData);
        
            // Detect poses in the image
            const poses = await modelRef.current!.estimatePoses(
                imageTensor,
                undefined,
                Date.now()
            );

            // Filter out keypoints below MIN_KEYPOINT_SCORE
            const keypointsWithinThreshold = poses[0]?.keypoints.filter((k) => (k.score ?? 0) > MIN_KEYPOINT_SCORE);
            
            // Determine the centre of mass
            const centreOfMass = calculateCentreOfMass(keypointsWithinThreshold);
            if (centreOfMass) {
                keypointsWithinThreshold.push(centreOfMass);
                console.log('Centre of mass: ', centreOfMass);
            }
            
            // Analyse angles
            const elbowAngles = calculateLeftAndRightAnglesBetweenKeypoints(keypointsWithinThreshold, ['shoulder', 'elbow', 'wrist']);
            const legSeparationAngle = calculateLegSeparationAngle(keypointsWithinThreshold);
            const armpitAngles = calculateArmpitAngles(keypointsWithinThreshold);
            const kneeAngles = calculateLeftAndRightAnglesBetweenKeypoints(keypointsWithinThreshold, ['hip', 'knee', 'ankle']);
            setBodyAngles((prevState) => {
                const newAngles = {
                    elbowAngles: elbowAngles,
                    armpitAngles: armpitAngles,
                    legSeparationAngle: legSeparationAngle,
                    kneeAngles: kneeAngles,
                }
                return prevState === newAngles ? prevState : newAngles;
            });

            // Update the state with the keypoints within the threshold
            setKeypointsWithinThreshold(keypointsWithinThreshold);
            return poses;
        } catch (error) {
            console.error('Error occurred whilst using pose detection: ', error);
        } finally {
            // Dispose the model
            if (modelRef.current) {
                console.log('Disposing model...')
                modelRef.current.dispose();
            }
        }
    };

    useEffect(() => {
        (async () => {
            const poses = await predictPose(uri.imageUri);
            if (poses) {
                setPoses(poses);
                setIsLoaded(true);
            }
        })();
    }, [uri]);

    useEffect(() => {
        (async () => {
            return () => {
                if (modelRef.current) {
                    console.log('Disposing model...')
                    modelRef.current.dispose();
                }
            };
        })();
    }, [uri]);

    return isLoaded && poses ? (
        <ScrollView 
            contentContainerStyle={{
                width: TARGET_IMAGE_WIDTH / 2, 
                ...containerStyle
            }}
        >
            <Canvas style={{ width: TARGET_IMAGE_WIDTH / 2, height: TARGET_IMAGE_HEIGHT / 2 }}>
                <SkiaImage image={image} fit={"contain"} x={0} y={0} width={TARGET_IMAGE_WIDTH / 2} height={TARGET_IMAGE_HEIGHT / 2} />
                    {keypointsWithinThreshold && <Points
                        points={
                            keypointsWithinThreshold.map(k => {
                                const originalWidth = image!.width();
                                const originalHeight = image!.height();
    
                                const normalizedX = (k.x / originalWidth) * TARGET_IMAGE_WIDTH / 2;
                                const normalizedY = (k.y / originalHeight) * TARGET_IMAGE_HEIGHT / 2;
    
                                return vec(normalizedX, normalizedY);
                            })
                        }
                        mode="points"
                        color="rgba(255, 0, 0, 0.5)"
                        style="stroke"
                        strokeWidth={7}
                    />}
            </Canvas>
            {bodyAngles ? (
                <View style={{ width: TARGET_IMAGE_WIDTH / 2, backgroundColor: isDark ? 'black' : 'white', borderColor: isDark ? 'white' : 'black', borderWidth: 2 }}>
                    <Text style={{ borderColor: isDark ? 'white' : 'black', borderWidth: 1 }}>Pose Metrics</Text>
                    <Text style={{ borderColor: isDark ? 'white' : 'black', borderWidth: 1 }}>Video: {uri.videoUri.split('/').pop()}</Text>
                    {bodyAngles.elbowAngles && (
                        <View style={{ borderColor: isDark ? 'white' : 'black', borderWidth: 1 }}>
                            <Text>Elbow Flexion/Extension Angles:</Text>
                            <Text>Left: {bodyAngles.elbowAngles.left !== null ? `${bodyAngles.elbowAngles.left} degrees` : 'Not available'}</Text>
                            <Text>Right: {bodyAngles.elbowAngles.right !== null ? `${bodyAngles.elbowAngles.right} degrees` : 'Not available'}</Text>
                        </View>
                    )}
                    {bodyAngles.armpitAngles && (
                        <View style={{ borderColor: isDark ? 'white' : 'black', borderWidth: 1 }}>
                            <Text>Armpit Angles:</Text>
                            <Text>Left: {bodyAngles.armpitAngles.left !== null ? `${bodyAngles.armpitAngles.left} degrees` : 'Not available'}</Text>
                            <Text>Right: {bodyAngles.armpitAngles.right !== null ? `${bodyAngles.armpitAngles.right} degrees` : 'Not available'}</Text>
                        </View>
                    )}
                    {bodyAngles.legSeparationAngle && (
                        <View style={{ borderColor: isDark ? 'white' : 'black', borderWidth: 1 }}>
                            <Text>Leg Separation Angle (angle between the legs):</Text>
                            <Text>
                                {
                                    bodyAngles.legSeparationAngle.left !== null && bodyAngles.legSeparationAngle.right !== null 
                                    ? `${bodyAngles.legSeparationAngle.left + bodyAngles.legSeparationAngle.right} degrees` 
                                    : 'Not available'
                                }
                            </Text>
                        </View>
                    )}
                    {bodyAngles.kneeAngles && (
                        <View style={{ borderColor: isDark ? 'white' : 'black', borderWidth: 1 }}>
                            <Text>Knee Flexion/Extension Angles:</Text>
                            <Text>Left: {bodyAngles.kneeAngles.left !== null ? `${bodyAngles.kneeAngles.left} degrees` : 'Not available'}</Text>
                            <Text>Right: {bodyAngles.kneeAngles.right !== null ? `${bodyAngles.kneeAngles.right} degrees` : 'Not available'}</Text>
                        </View>
                    )}
                </View>
            ) : (
                <Text>No pose metrics to display</Text>
            )}
        </ScrollView>
    ) : (
        <ActivityIndicator size={50} />
    );
};

export default PoseDetection;