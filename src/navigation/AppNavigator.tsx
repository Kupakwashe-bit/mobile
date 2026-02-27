import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import ExploreScreen from '../screens/home/ExploreScreen';
import CartScreen from '../screens/home/CartScreen';
import ProductDetailScreen from '../screens/home/ProductDetailScreen';
import ShopsScreen from '../screens/home/ShopsScreen';
import OrderTrackingScreen from '../screens/home/OrderTrackingScreen';
import AdminDashboardScreen from '../screens/home/AdminDashboardScreen';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#1A1A1A',
                    borderTopWidth: 0,
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: '#C0392B',
                tabBarInactiveTintColor: '#555',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
                }}
            />
            <Tab.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🔍</Text>,
                }}
            />
            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🛒</Text>,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={PlaceholderScreen}
                options={{
                    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>,
                }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeTabs" component={HomeTabs} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Shops" component={ShopsScreen} />
            <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        </Stack.Navigator>
    );
}

function PlaceholderScreen({ route }: any) {
    return (
        <View className="flex-1 items-center justify-center bg-surface">
            <Text className="text-xl font-bold text-white">{route.name} Coming Soon</Text>
        </View>
    );
}
