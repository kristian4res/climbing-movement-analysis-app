import React, { useContext, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Link } from 'expo-router';
import CMALogo from '../assets/images/workout-1.svg';
import { SCREEN_WIDTH } from '@/constants/Dimensions';
import { ThemeContext } from '@/context/themeContext';
import Colors from '@/constants/Colors';

export default function SignUpScreen() {
    const { isDark } = useContext(ThemeContext);
    const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSignUp = () => {
        if (username.trim() === "" || password.trim() === "" || email.trim() === "") {
            console.log("Cannot sign up user with empty form");
            Alert.alert(
                "Incomplete Form",
                "Please ensure all fields are filled out." 
            )
            return;
        }

        console.log('Signing up user: ', username);
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
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                left={<TextInput.Icon icon={'email'} />}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                left={<TextInput.Icon icon={'lock'} />}
            />
            <Button mode='contained' onPress={handleSignUp}>
                Sign Up
            </Button>
            <Link style={styles.link} href={'../sign-in'}>
                Already have an account?
            </Link>
        </View>
    );
}