import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { API_BASE_URL } from '../../config/api';
import { useAuthStore } from '../../store/auth.store';
import axios from 'axios';

export default function AdminDashboardScreen() {
    const { accessToken, user } = useAuthStore();
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/v1/orders`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setOrders(res.data);
        } catch (err) {
            console.error('Failed to load orders', err);
        }
    };

    const updateOrderStatus = async (orderId: string, currentStatus: string) => {
        const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'ON_WAY', 'DELIVERED', 'CANCELLED'];
        const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
        const nextStatus = statuses[nextIndex];

        try {
            await axios.patch(`${API_BASE_URL}/api/v1/orders/${orderId}/status`, { status: nextStatus }, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            fetchOrders();
            Alert.alert("Success", `Order status updated to ${nextStatus}`);
        } catch (err) {
            Alert.alert("Error", "Failed to update status");
        }
    };

    return (
        <View className="flex-1 bg-background p-4">
            <Text className="text-2xl font-bold text-white mb-4">Admin Dashboard</Text>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="bg-surface p-4 rounded-xl mb-4 border border-gray-800">
                        <Text className="text-white font-bold text-lg mb-2">Order: {item.id}</Text>
                        <Text className="text-gray-400 mb-1">Customer: {item.customer?.email || item.customerId}</Text>
                        <Text className="text-gray-400 mb-3">Total: ${item.totalAmount}</Text>

                        <View className="flex-row items-center justify-between">
                            <Text className="text-primary font-semibold">{item.status}</Text>
                            <TouchableOpacity
                                className="bg-primary/20 px-4 py-2 rounded-lg border border-primary/50"
                                onPress={() => updateOrderStatus(item.id, item.status)}
                            >
                                <Text className="text-primary font-medium">Next Status</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text className="text-gray-400">No orders found.</Text>}
            />
        </View>
    );
}
