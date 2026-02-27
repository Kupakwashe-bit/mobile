import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ShopCardProps {
    shop: {
        id: string;
        name: string;
        ownerId: string;
    };
    onPress: () => void;
}

export default function ShopCard({ shop, onPress }: ShopCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="mb-4 flex-row items-center rounded-3xl bg-card p-4 shadow-sm"
            activeOpacity={0.85}
        >
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-surface">
                <Text className="text-3xl">🏪</Text>
            </View>
            <View className="ml-4 flex-1">
                <Text className="text-base font-bold text-white">{shop.name}</Text>
                <Text className="text-xs text-gray-400">Vendor ID: {shop.ownerId.substring(0, 8)}...</Text>
            </View>
            <View className="ml-2 h-10 w-10 items-center justify-center rounded-full bg-surface">
                <Text className="text-xl text-brand">›</Text>
            </View>
        </TouchableOpacity>
    );
}
