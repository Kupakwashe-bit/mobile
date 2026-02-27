import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import apiClient from '../../lib/apiClient';
import { useCartStore } from '../../store/cart.store';

export default function ProductDetailScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { productId } = route.params;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await apiClient.get(`/api/v1/products/${productId}`);
                setProduct(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    if (loading) return <ActivityIndicator className="flex-1" color="#C0392B" />;
    if (!product) return <View className="flex-1 items-center justify-center"><Text>Product not found</Text></View>;

    return (
        <View className="flex-1 bg-surface">
            <ScrollView>
                <View className="h-80 w-full bg-card items-center justify-center">
                    <Text className="text-9xl">🛍️</Text>
                </View>

                <View className="p-6">
                    <Text className="text-sm font-semibold text-brand uppercase tracking-widest">
                        {product.shop.name}
                    </Text>
                    <Text className="mt-2 text-3xl font-bold text-white">
                        {product.name}
                    </Text>
                    <Text className="mt-3 text-2xl font-bold text-white">
                        ${Number(product.price).toFixed(2)}
                    </Text>

                    <View className="mt-6 border-t border-border pt-6">
                        <Text className="text-lg font-bold text-white">Description</Text>
                        <Text className="mt-2 text-base leading-6 text-gray-400">
                            {product.description || 'No description provided for this premium item.'}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Footer / Add to Cart */}
            <View className="border-t border-border bg-card px-6 py-4 pb-8">
                <TouchableOpacity
                    className="flex-row items-center justify-center rounded-2xl bg-brand py-4 shadow-lg"
                    activeOpacity={0.9}
                    onPress={() => {
                        addItem(product, product.shop);
                        navigation.navigate('HomeTabs', { screen: 'Cart' });
                    }}
                >
                    <Text className="text-xl mr-2">🛒</Text>
                    <Text className="text-lg font-bold text-white">Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
