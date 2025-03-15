import { StyleSheet, View } from 'react-native';
import TouchableVideoList from '@/components/lists/TouchableVideoList';
import { ThemeContext } from '@/context/themeContext';
import { useContext } from 'react';
import Colors from '@/constants/Colors';

export default function ClimbsScreen() {
  const { isDark } = useContext(ThemeContext);
  const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;
  
  return (
    <View style={{...containerStyle}}>
      <TouchableVideoList />
    </View>
  );
}

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
});
