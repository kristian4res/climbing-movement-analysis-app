import React, { useContext } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import NoDataFoundSVG from '../assets/images/no-data.svg';
import { ThemeContext } from '@/context/themeContext';
import Colors from '@/constants/Colors';

const NoDataFound = ({ description }: { description: string }) => {
  const { isDark } = useContext(ThemeContext);
  const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;
  
  return (
    <View style={{ padding: 20, ...containerStyle}}>
      <NoDataFoundSVG width={100} height={100} />
      <Text style={{ fontSize: 16, marginTop: 5 }}>{ description }</Text>
    </View>
  );
};

export default NoDataFound;