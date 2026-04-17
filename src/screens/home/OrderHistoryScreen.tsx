import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../lib/apiClient';

export default function OrderHistoryScreen() {
    const navigation = useNavigation<any>();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await apiClient.get('/api/v1/orders');
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchOrders();
        });
        return unsubscribe;
    }, [navigation]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Order History</Text>
                    <Text style={styles.headerSub}>Review your past orders</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator color="#C0392B" size="large" />
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.orderCard} 
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
                        >
                            <View style={styles.orderHeader}>
                                <Text style={styles.shopName}>{item.shop?.name || 'Shop'}</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>{item.status}</Text>
                                </View>
                            </View>
                            
                            <Text style={styles.orderId}>Order ID: {item.id.substring(0, 8)}...</Text>
                            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
                            
                            <View style={styles.orderFooter}>
                                <Text style={styles.itemCount}>
                                    {item.items?.length || 0} item(s)
                                </Text>
                                <Text style={styles.totalAmount}>${Number(item.totalAmount).toFixed(2)}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyWrap}>
                            <Text style={styles.emptyIcon}>📦</Text>
                            <Text style={styles.emptyTitle}>No Orders Yet</Text>
                            <Text style={styles.emptySub}>When you place an order, it will appear here.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const C = { surface: '#0F0F0F', card: '#1A1A1A', border: '#2A2A2A', brand: '#C0392B', white: '#FFFFFF', gray400: '#9CA3AF', gray500: '#6B7280' };

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.surface },
    header: { backgroundColor: C.card, paddingHorizontal: 24, paddingBottom: 24, paddingTop: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: C.white },
    headerSub: { fontSize: 14, color: C.gray400 },
    closeBtn: { height: 40, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: C.surface },
    closeBtnText: { color: C.white, fontWeight: 'bold' },
    loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyWrap: { marginTop: 80, alignItems: 'center', paddingHorizontal: 24 },
    emptyIcon: { fontSize: 64, marginBottom: 16 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: C.white },
    emptySub: { marginTop: 8, textAlign: 'center', color: C.gray400 },
    orderCard: { backgroundColor: C.card, padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: C.border },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    shopName: { fontSize: 16, fontWeight: 'bold', color: C.white },
    statusBadge: { backgroundColor: 'rgba(192,57,43,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(192,57,43,0.5)' },
    statusText: { color: C.brand, fontSize: 12, fontWeight: 'bold' },
    orderId: { color: C.gray400, fontSize: 14, marginBottom: 4 },
    orderDate: { color: C.gray500, fontSize: 12, marginBottom: 16 },
    orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: C.border, paddingTop: 12 },
    itemCount: { color: C.gray400, fontSize: 14 },
    totalAmount: { color: C.white, fontSize: 18, fontWeight: 'bold' },
});
