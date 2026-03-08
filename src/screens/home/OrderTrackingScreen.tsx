import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../../config/api';
import { useAuthStore } from '../../store/auth.store';
import axios from 'axios';

export default function OrderTrackingScreen() {
    const route = useRoute<any>();
    const { orderId } = route.params || {};
    const { accessToken } = useAuthStore();
    const [status, setStatus] = useState<string>('Loading...');
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!orderId) { setStatus('No Order Selected'); return; }

        const fetchInitialOrder = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/v1/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setStatus(res.data.status);
            } catch { setStatus('Failed to load order'); }
        };
        fetchInitialOrder();

        const newSocket = io(API_BASE_URL);
        newSocket.on('connect', () => { newSocket.emit('joinOrderRoom', { orderId }); });
        newSocket.on('orderStatusUpdated', (data: { orderId: string; status: string }) => {
            if (data.orderId === orderId) setStatus(data.status);
        });
        setSocket(newSocket);
        return () => { newSocket.disconnect(); };
    }, [orderId, accessToken]);

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Order Tracking</Text>

            <View style={styles.card}>
                <Text style={styles.statusLabel}>Current Status:</Text>

                {status === 'Loading...' ? (
                    <ActivityIndicator size="large" color="#C0392B" />
                ) : (
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{status}</Text>
                    </View>
                )}

                <Text style={styles.orderId}>Order ID: {orderId}</Text>
            </View>
        </View>
    );
}

const C = { surface: '#0F0F0F', card: '#1A1A1A', border: '#2A2A2A', brand: '#C0392B', white: '#FFFFFF', gray400: '#9CA3AF', gray500: '#6B7280' };

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.surface, padding: 16, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', color: C.white, marginBottom: 32 },
    card: { backgroundColor: C.card, padding: 32, borderRadius: 16, borderWidth: 1, borderColor: '#374151', width: '100%', alignItems: 'center' },
    statusLabel: { color: C.gray400, fontSize: 18, marginBottom: 12 },
    statusBadge: { backgroundColor: 'rgba(192,57,43,0.2)', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(192,57,43,0.5)' },
    statusText: { color: C.brand, fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase' },
    orderId: { color: C.gray500, marginTop: 24, fontSize: 14 },
});
