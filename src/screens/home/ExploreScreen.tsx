import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import apiClient from '../../lib/apiClient';
import ProductCard from '../../components/ProductCard';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ExploreScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const shopId = route.params?.shopId;

    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async (term = '') => {
        setLoading(true);
        try {
            const { data } = await apiClient.get('/api/v1/products', {
                params: { search: term, ...(shopId && { shopId }) },
            });
            setProducts(data);
        } catch (err) { console.error('Failed to fetch products', err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(search); }, [shopId]);

    const handleSearch = (text: string) => { setSearch(text); fetchProducts(text); };

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore Items</Text>
                <View style={styles.searchBox}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products or shops..."
                        placeholderTextColor="#555"
                        value={search}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator color="#C0392B" size="large" />
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item: any) => item.id}
                    numColumns={2}
                    contentContainerStyle={{ padding: 16 }}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    renderItem={({ item }: { item: any }) => (
                        <ProductCard
                            product={item}
                            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyWrap}>
                            <Text style={styles.emptyText}>No products found.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const C = { surface: '#0F0F0F', card: '#1A1A1A', white: '#FFFFFF', gray500: '#6B7280' };

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.surface },
    header: { backgroundColor: C.card, paddingHorizontal: 24, paddingBottom: 24, paddingTop: 56 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: C.white },
    searchBox: { marginTop: 16, flexDirection: 'row', alignItems: 'center', borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 16, paddingVertical: 12 },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, fontSize: 16, color: C.white },
    loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyWrap: { marginTop: 80, alignItems: 'center' },
    emptyText: { color: C.gray500 },
});
