import { Button, Card, Title, Paragraph, Switch } from 'react-native-paper';
import { useSession } from '@/context/authContext';
import { StatusBar } from 'expo-status-bar';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ThemeContext } from '@/context/themeContext';
import { useContext } from 'react';
import Colors from '@/constants/Colors';

export default function AccountSettingsScreen() {
  const { signOut } = useSession();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;

  return (
    <View style={{...containerStyle, padding: 16}}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Account Settings</Title>
          <Paragraph style={styles.text}>
            Here you can manage your account settings and sign out of the application.
          </Paragraph>
          <View style={styles.themeToggle}>
            <Paragraph style={styles.text}>Dark Mode</Paragraph>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button mode='contained' onPress={() => {
            Alert.alert(
              "Sign Out",
              "Are you sure you want to sign out?",
              [
                {
                  text: "Cancel",
                  style: "cancel"
                },
                { text: "OK", onPress: () => {
                  signOut();
                  return router.replace('/sign-in');
                }}
              ]
            );
          }}>
            Sign Out
          </Button>
        </Card.Actions>
      </Card>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  themeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  actions: {
    justifyContent: 'center',
  },
});