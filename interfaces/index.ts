import * as MediaLibrary from 'expo-media-library';
import { Dispatch, SetStateAction } from 'react';

export interface TouchableVideoListProps {
    limit?: number;
}

export interface InteractiveVideoListProps {
    videos: MediaLibrary.Asset[];
    setVideos: Dispatch<SetStateAction<MediaLibrary.Asset[]>>;
};

export interface PulsingCircleProps {
    isActive: boolean;
}

export type UserGuides = {
    title: string;
    instructions: string[];
};

export type JSONValues = {
    [key: string]: UserGuides;
};