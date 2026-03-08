import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../lib/apiClient';
import ShopCard from '../../components/ShopCard';

export default function ShopsScreen() {
    const navigation = useNavigation<any>();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchShops = async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get('/api/v1/shops');
            setShops(data);
        } catch (err) { console.error('Failed to fetch shops', err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchShops(); }, []);

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Local Shops</Text>
                    <Text style={styles.headerSub}>Discover vendors near you</Text>
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
                    data={shops}
                    keyExtractor={(item: any) => item.id}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => (
                        <ShopCard
                            shop={item}
                            onPress={() => navigation.navigate('Explore', { shopId: item.id })}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyWrap}>
                            <Text style={styles.emptyText}>No shops available right now.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const C = { surface: '#0F0F0F', card: '#1A1A1A', white: '#FFFFFF', gray400: '#9CA3AF', gray500: '#6B7280' };

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.surface },
    header: { backgroundColor: C.card, paddingHorizontal: 24, paddingBottom: 24, paddingTop: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: C.white },
    headerSub: { fontSize: 14, color: C.gray400 },
    closeBtn: { height: 40, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: C.surface },
    closeBtnText: { color: C.white, fontWeight: 'bold' },
    loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyWrap: { marginTop: 80, alignItems: 'center' },
    emptyText: { color: C.gray500 },
});
