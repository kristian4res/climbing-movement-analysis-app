import { StyleSheet } from 'react-native';
import lightTheme from '@/assets/themes/light.json';
import darkTheme from '@/assets/themes/dark.json';

export default StyleSheet.create({
  lightContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: lightTheme.colors.background,
  },
  darkContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkTheme.colors.background,
  },
  lightBackground: {
    backgroundColor: lightTheme.colors.background,
  },
  darkBackground: {
    backgroundColor: darkTheme.colors.background,
  }
});