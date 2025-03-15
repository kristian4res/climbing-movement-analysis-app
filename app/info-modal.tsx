import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Colors from '@/constants/Colors';
import { useContext } from 'react';
import { ThemeContext } from '@/context/themeContext';

export default function InfoModalScreen() {
  const { isDark } = useContext(ThemeContext);
  const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;

  return (
    <View style={containerStyle}>
      <Text style={styles.title}>Information</Text>
      <View style={styles.separator}  />
      <Text style={styles.instructions}>
        To use the camera, press the camera button on the bottom right of the screen. 
        This will open the camera view. You can then take a photo by pressing the shutter button.
      </Text>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});