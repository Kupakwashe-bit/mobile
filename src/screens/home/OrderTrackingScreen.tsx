import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../../config/api';
import { useAuthStore } from '../../store/auth.store';
import axios from 'axios';

export default function OrderTrackingScreen() {
    const route = useRoute<any>();
    const { orderId } = route.params || {};
    const { accessToken, user } = useAuthStore();
    const [status, setStatus] = useState<string>('Loading...');
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!orderId) {
            setStatus('No Order Selected');
            return;
        }

        const fetchInitialOrder = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/v1/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setStatus(res.data.status);
            } catch (err) {
                setStatus('Failed to load order');
            }
        };

        fetchInitialOrder();

        const newSocket = io(API_BASE_URL);

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket server');
            newSocket.emit('joinOrderRoom', { orderId });
        });

        newSocket.on('orderStatusUpdated', (data: { orderId: string, status: string }) => {
            if (data.orderId === orderId) {
                setStatus(data.status);
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [orderId, accessToken]);

    return (
        <View className="flex-1 bg-background p-4 flex flex-col items-center justify-center">
            <Text className="text-3xl font-bold text-white mb-8">Order Tracking</Text>

            <View className="bg-surface p-8 rounded-2xl border border-gray-800 w-full flex items-center shadow-lg">
                <Text className="text-gray-400 text-lg mb-2">Current Status:</Text>

                {status === 'Loading...' ? (
                    <ActivityIndicator size="large" color="#C0392B" />
                ) : (
                    <View className="bg-primary/20 px-6 py-3 rounded-full border border-primary/50">
                        <Text className="text-primary text-2xl font-bold uppercase tracking-wider">
                            {status}
                        </Text>
                    </View>
                )}

                <Text className="text-gray-500 mt-6 text-sm">Order ID: {orderId}</Text>
            </View>
        </View>
    );
}
