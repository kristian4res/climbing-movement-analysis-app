import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { Link, Redirect, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import { useClientOnlyValue } from '@/hooks/useClientOnlyValue';
import { useSession } from '@/context/authContext';
import { Tooltip, useTheme } from 'react-native-paper';

function TabBarIcon({ name, color, style }: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  style?: React.CSSProperties;
}) {
  const customStyles = style ? style : {};
  return <FontAwesome size={24} style={[{ marginBottom: -3 }, customStyles]} name={name} color={color} />;
}

export default function TabLayout() {
  const theme = useTheme();
  const { session, isLoading } = useSession();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Tooltip title={'Account settings'}>
              <Link href="/account-settings" asChild>
                <Pressable>
                  {({ pressed }) => (
                      <TabBarIcon
                        name="user-cog"
                        color={theme.colors.secondary}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                </Pressable>
              </Link>
            </Tooltip>
          ),
        }}
      />
      <Tabs.Screen
        name="climbs"
        options={{
          title: 'Climbs',
          tabBarIcon: ({ color }) => <TabBarIcon name="mountain" color={color} />,
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          title: 'Guides',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="analyse"
        options={{
          title: 'Analyse',
          tabBarIcon: ({ color }) => <TabBarIcon name="flask" color={color} />,
        }}
      />
      <Tabs.Screen
        name="recorder"
        options={{
          title: 'Recorder',
          tabBarIcon: ({ color }) => <TabBarIcon name="camera" color={color} />,
          headerRight: () => (
            <Tooltip title={'Recorder tips'}>
              <Link href="/info-modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                      <TabBarIcon
                        name="info-circle"
                        color={theme.colors.secondary}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                </Pressable>
              </Link>
            </Tooltip>
          ),
        }}
      />
    </Tabs>
  );
}