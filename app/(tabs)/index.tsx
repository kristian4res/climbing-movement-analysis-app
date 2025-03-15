import { StyleSheet, View } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import React, { useContext } from 'react';
import { Link } from 'expo-router';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/constants/Dimensions';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from '@/context/themeContext';
import Colors from '@/constants/Colors';
import LightweightVideoList from '@/components/lists/LightweightVideoList';

export default function HomepageScreen() {  
  const { isDark } = useContext(ThemeContext);
  const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;
  
  return (
    <ScrollView contentContainerStyle={{...containerStyle, flex: 0, gap: 20}}>
      <Card style={styles.container}>
        <Card.Content>
          <Title style={styles.title}>Welcome to Climbing Movement Analyser</Title>
          <Paragraph style={styles.text}>
            Capture and analyze your movements using pose estimation. See the nuances in your movements and improve your performance.
          </Paragraph>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Link href='/(tabs)/recorder' asChild>
            <Button mode='contained'>
              Start
            </Button>
          </Link>
        </Card.Actions>
      </Card>
      <Card style={styles.container}>
        <Card.Content style={styles.cardContent}>
          <Title style={styles.title}>Recent Climbs</Title>
          <LightweightVideoList limit={4} />
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Link href='/(tabs)/climbs' asChild>
            <Button mode='contained'>
              View All Climbs
            </Button>
          </Link>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginVertical: 10,
    width: SCREEN_WIDTH * .85,
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  actions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  image: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.4,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});