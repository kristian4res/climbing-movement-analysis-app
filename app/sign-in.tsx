import React, { useContext, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Icon, Text, TextInput, useTheme } from 'react-native-paper';
import { Link } from 'expo-router';
import { useSession } from '@/context/authContext';
import CMALogo from '../assets/images/workout-1.svg';
import { SCREEN_WIDTH } from '@/constants/Dimensions';
import { ThemeContext } from '@/context/themeContext';
import Colors from '@/constants/Colors';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function SignInScreen() {
    const { isDark } = useContext(ThemeContext);
    const theme = useTheme();
    const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;
    const { signIn } = useSession();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {
        if (username.trim() === "" || password.trim() === "") {
            console.log("Cannot sign in user with empty form");
            Alert.alert(
                "Incomplete Form",
                "Please ensure all fields are filled out." 
            )
            return;
        }

        console.log('Signing in user: ', username);
        signIn();
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: 16,
        },
        svg: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            maxHeight: 300,
            width: SCREEN_WIDTH
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
        },
        input: {
            height: 40,
            width: '100%',
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 12,
        },
        link: {
            marginTop: 16,
        },
    });

    return (
        <View style={{...containerStyle, padding: 16}}>
            <View style={styles.svg}>
                <CMALogo  width={250} height={250} />
            </View>
            <Text style={styles.title}>Climbing Movement Analyser</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                left={<TextInput.Icon icon={'account'} />}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                left={<TextInput.Icon icon={'lock'} />}
            />
            <Button mode='contained' onPress={handleSignIn}>
                Sign In
            </Button>
            <Link style={styles.link} href={'../sign-up'}>
                Don't have an account?
            </Link>
        </View>
    );
}