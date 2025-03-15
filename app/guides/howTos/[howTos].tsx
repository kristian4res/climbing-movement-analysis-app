import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Surface, Text } from 'react-native-paper';
import React, { useContext } from 'react';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/constants/Dimensions';
import { ThemeContext } from '@/context/themeContext';
import Colors from '@/constants/Colors';
import { JSONValues } from '@/interfaces';
const guides: { userGuides: JSONValues } = require("../../../data/guides.json");

export default function HowTosScreen() {
    const { howTos: guideTitle } = useLocalSearchParams<{ howTos: string }>();
    const { title, instructions  } = guides.userGuides[`${guideTitle}`];
    const { isDark } = useContext(ThemeContext);
    const containerStyle = isDark ? Colors.darkContainer : Colors.lightContainer;

    return (
        <View style={{...containerStyle, padding: 20}}>
            <Surface style={{padding: 10}} elevation={4}>
                <Text variant='titleLarge' style={styles.listHeading}>
                    {title}:
                </Text>
                {
                    instructions.map((step, index) => {
                        return (
                            <Text variant="bodyLarge" style={styles.listItem} key={index}>
                                {step}
                            </Text>
                        )
                    })
                }
            </Surface>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
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
    guideText: {
        fontSize: 16,
        lineHeight: 24,
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    listHeading: {
        fontWeight: 'bold',
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    listItem: {
        lineHeight: 24,
        marginBottom: 10,
        paddingHorizontal: 15,
    },
});