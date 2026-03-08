import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { API_BASE_URL } from '../../config/api';
import { useAuthStore } from '../../store/auth.store';
import axios from 'axios';

export default function AdminDashboardScreen() {
    const { accessToken } = useAuthStore();
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/v1/orders`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setOrders(res.data);
        } catch (err) { console.error('Failed to load orders', err); }
    };

    const updateOrderStatus = async (orderId: string, currentStatus: string) => {
        const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'ON_WAY', 'DELIVERED', 'CANCELLED'];
        const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];
        try {
            await axios.patch(`${API_BASE_URL}/api/v1/orders/${orderId}/status`, { status: nextStatus }, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            fetchOrders();
            Alert.alert('Success', `Order status updated to ${nextStatus}`);
        } catch { Alert.alert('Error', 'Failed to update status'); }
    };

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.orderCard}>
                        <Text style={styles.orderId}>Order: {item.id}</Text>
                        <Text style={styles.orderInfo}>Customer: {item.customer?.email || item.customerId}</Text>
                        <Text style={styles.orderInfo}>Total: ${item.totalAmount}</Text>
                        <View style={styles.orderFooter}>
                            <Text style={styles.orderStatus}>{item.status}</Text>
                            <TouchableOpacity
                                style={styles.nextStatusBtn}
                                onPress={() => updateOrderStatus(item.id, item.status)}
                            >
                                <Text style={styles.nextStatusText}>Next Status</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No orders found.</Text>}
            />
        </View>
    );
}

const C = { surface: '#0F0F0F', card: '#1A1A1A', brand: '#C0392B', white: '#FFFFFF', gray400: '#9CA3AF' };

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.surface, padding: 16, paddingTop: 56 },
    title: { fontSize: 24, fontWeight: 'bold', color: C.white, marginBottom: 16 },
    orderCard: { backgroundColor: C.card, padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#374151' },
    orderId: { color: C.white, fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
    orderInfo: { color: C.gray400, marginBottom: 4 },
    orderFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
    orderStatus: { color: C.brand, fontWeight: '600' },
    nextStatusBtn: { backgroundColor: 'rgba(192,57,43,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(192,57,43,0.5)' },
    nextStatusText: { color: C.brand, fontWeight: '500' },
    emptyText: { color: C.gray400 },
});
