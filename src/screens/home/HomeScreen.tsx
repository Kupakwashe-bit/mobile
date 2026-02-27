import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuthStore } from '../../store/auth.store';

import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const { user, logout } = useAuthStore();
    const navigation = useNavigation<any>();

    const handleActionPress = (label: string) => {
        switch (label) {
            case 'Shops':
                navigation.navigate('Shops');
                break;
            case 'Cart':
                navigation.navigate('Cart');
                break;
            case 'Explore':
                navigation.navigate('Explore');
                break;
            case 'Profile':
                navigation.navigate('Profile');
                break;
            case 'Orders':
                navigation.navigate('OrderTracking');
                break;
            case 'Admin':
                navigation.navigate('AdminDashboard');
                break;
            default:
                break;
        }
    };

    return (
        <View className="flex-1 bg-surface">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Header */}
                <View className="bg-card px-6 pb-6 pt-14">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-sm text-gray-400">Welcome back,</Text>
                            <Text className="text-xl font-bold text-white">
                                {user?.email?.split('@')[0] ?? 'User'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={logout}
                            className="rounded-xl border border-border px-4 py-2"
                        >
                            <Text className="text-sm font-medium text-gray-300">Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Hero Banner */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Explore')}
                    activeOpacity={0.9}
                    className="mx-6 mt-6 overflow-hidden rounded-3xl bg-brand p-6"
                >
                    <Text className="text-xs font-semibold uppercase tracking-widest text-red-200">
                        VenCapital Marketplace
                    </Text>
                    <Text className="mt-2 text-2xl font-bold text-white">
                        Discover Local Shops &amp; Vendors
                    </Text>
                    <Text className="mt-2 text-sm text-red-100">
                        Order from hundreds of vendors near you
                    </Text>
                    <View className="mt-4 self-start rounded-xl bg-white px-5 py-2.5">
                        <Text className="font-bold text-brand">Explore Now</Text>
                    </View>
                </TouchableOpacity>

                {/* Quick Actions */}
                <View className="mx-6 mt-6">
                    <Text className="mb-4 text-lg font-bold text-white">
                        Quick Actions
                    </Text>
                    <View className="flex-row gap-3">
                        {QUICK_ACTIONS.map((action) => (
                            <TouchableOpacity
                                key={action.label}
                                onPress={() => handleActionPress(action.label)}
                                className="flex-1 items-center rounded-2xl bg-card p-4"
                            >
                                <Text className="text-3xl">{action.icon}</Text>
                                <Text className="mt-2 text-center text-xs font-medium text-gray-300">
                                    {action.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Coming Soon */}
                <View className="mx-6 mt-6 rounded-2xl border border-border bg-card p-4">
                    <Text className="text-xs font-semibold uppercase tracking-widest text-brand">
                        Sprint 2 Coming Soon
                    </Text>
                    <Text className="mt-1 text-base font-semibold text-white">
                        Shop Directory &amp; Search
                    </Text>
                    <Text className="mt-1 text-sm text-gray-400">
                        Browse nearby shops, filter by category, and search products.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const QUICK_ACTIONS = [
    { icon: '🏪', label: 'Shops' },
    { icon: '🛒', label: 'Cart' },
    { icon: '📦', label: 'Orders' },
    { icon: '🛡️', label: 'Admin' },
];
