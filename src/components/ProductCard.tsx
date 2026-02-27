import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number | string;
        shop: { name: string };
    };
    onPress?: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
    const navigation = useNavigation<any>();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            navigation.navigate('ProductDetail', { productId: product.id });
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="mb-4 w-[48%] overflow-hidden rounded-3xl bg-card shadow-sm"
            activeOpacity={0.85}
        >
            <View className="h-40 w-full bg-surface items-center justify-center">
                {/* Placeholder for Product Image */}
                <Text className="text-4xl">🛍️</Text>
            </View>
            <View className="p-3">
                <Text className="text-xs font-semibold text-brand" numberOfLines={1}>
                    {product.shop.name}
                </Text>
                <Text className="mt-1 text-sm font-bold text-white" numberOfLines={1}>
                    {product.name}
                </Text>
                <Text className="mt-1 text-base font-bold text-white">
                    ${Number(product.price).toFixed(2)}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
