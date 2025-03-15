import React from 'react';
import { useStorageState } from '../hooks/useStorageState';
import { router, useNavigation } from 'expo-router';

const AuthContext = React.createContext<{
    signIn: () => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});

export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const navigator = useNavigation();

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          setSession('example');
          console.log('Signed in user: ', 'example');
          router.replace('/(tabs)');
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
