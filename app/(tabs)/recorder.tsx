import { Dimensions, StyleSheet, View } from 'react-native';

import React, { useCallback, useContext, useState } from 'react';
import CameraView from '@/components/CameraView';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '@/context/themeContext';
import Colors from '@/constants/Colors';


export default function RecorderScreen() {
  const [isFocused, setIsFocused] = useState(false);
  const { isDark } = useContext(ThemeContext);
  const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;

  useFocusEffect(
    useCallback(() => {
      console.log('CameraView is focused');
      setIsFocused(true);

      return () => {
        console.log('CameraView is not focused');
        setIsFocused(false);
      };
    }, [])
  );

  return (
    <View style={{...containerStyle}}>
      {
        isFocused ? <CameraView /> : null
      }
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  camera: {
    flex: 1,
    width: width,
    height: height,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});