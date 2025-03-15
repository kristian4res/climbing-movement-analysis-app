import { PulsingCircleProps } from '@/interfaces';
import React, { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const PulsingCircle: React.FC<PulsingCircleProps> = ({ isActive }) => {
    const scale = useSharedValue(1);

    useEffect(() => {
        if (isActive) {
            scale.value = withRepeat(
            withTiming(1.3, {
                duration: 500,
                easing: Easing.ease,
            }),
            -1,
            true
            );
        } else {
            scale.value = 1;
        }
    }, [isActive]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <Animated.View
            testID={'pulsing-circle'}
            style={[
            {
                position: 'absolute',
                zIndex: 11,
                top: 20,
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: isActive ? 'red' : 'white',
            },
            animatedStyle,
            ]}
        />
    );
};

export default PulsingCircle;