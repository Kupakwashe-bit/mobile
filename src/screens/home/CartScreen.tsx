import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useCartStore } from '../../store/cart.store';
import apiClient from '../../lib/apiClient';

export default function CartScreen() {
    const { items, total, updateQuantity, removeItem, clearCart } = useCartStore();
    const [loading, setLoading] = React.useState(false);

    const handleCheckout = async () => {
        if (items.length === 0) return;
        setLoading(true);
        try {
            // Group items by shop for multi-vendor (Simplified: process first shop's items only for MVP)
            const shopId = items[0].shopId;
            const orderItems = items
                .filter((i) => i.shopId === shopId)
                .map((i) => ({ productId: i.productId, quantity: i.quantity }));

            await apiClient.post('/api/v1/orders', {
                shopId,
                items: orderItems,
            });

            alert('Order placed successfully!');
            clearCart();
        } catch (err: any) {
            alert('Checkout failed: ' + (err.response?.data?.message ?? 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <View className="flex-1 items-center justify-center bg-surface px-6">
                <Text className="text-6xl mb-4">🛒</Text>
                <Text className="text-2xl font-bold text-white">Your cart is empty</Text>
                <Text className="mt-2 text-center text-gray-400">
                    Looks like you haven't added anything to your cart yet.
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-surface">
            <View className="bg-card px-6 pb-6 pt-14">
                <Text className="text-2xl font-bold text-white">My Shopping Cart</Text>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.productId}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                    <View className="mb-4 flex-row items-center rounded-2xl bg-card p-4 shadow-sm">
                        <View className="h-16 w-16 items-center justify-center rounded-xl bg-surface">
                            <Text className="text-2xl">📦</Text>
                        </View>
                        <View className="ml-4 flex-1">
                            <Text className="text-sm font-semibold text-brand">
                                {item.shopName}
                            </Text>
                            <Text className="text-base font-bold text-white">{item.name}</Text>
                            <Text className="mt-1 text-lg font-bold text-white">
                                ${(item.price * item.quantity).toFixed(2)}
                            </Text>
                        </View>
                        <View className="items-center">
                            <View className="flex-row items-center rounded-xl bg-surface px-2 py-1">
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.productId, item.quantity - 1)}
                                    className="h-8 w-8 items-center justify-center"
                                >
                                    <Text className="text-xl text-brand">-</Text>
                                </TouchableOpacity>
                                <Text className="mx-3 font-bold text-white">{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                                    className="h-8 w-8 items-center justify-center"
                                >
                                    <Text className="text-xl text-brand">+</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                onPress={() => removeItem(item.productId)}
                                className="mt-2"
                            >
                                <Text className="text-xs text-gray-500">Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* Checkout Footer */}
            <View className="border-t border-border bg-card p-6 pb-8">
                <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-lg text-gray-400">Total Amount</Text>
                    <Text className="text-2xl font-bold text-white">
                        ${total.toFixed(2)}
                    </Text>
                </View>
                <TouchableOpacity
                    className="items-center rounded-2xl bg-brand py-4"
                    activeOpacity={0.85}
                    onPress={handleCheckout}
                    disabled={loading}
                >
                    <Text className="text-lg font-bold text-white">
                        {loading ? 'Processing...' : 'Checkout Now'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
