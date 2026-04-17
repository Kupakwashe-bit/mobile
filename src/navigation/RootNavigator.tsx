import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/auth.store';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

export default function RootNavigator() {
    const { accessToken, isHydrated, hydrate } = useAuthStore();

    // On first mount, read the token from AsyncStorage
    useEffect(() => {
        hydrate();
    }, []);

    // Show a loading screen while reading from disk
    if (!isHydrated) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F0F' }}>
                <ActivityIndicator size="large" color="#C0392B" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {accessToken ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}
