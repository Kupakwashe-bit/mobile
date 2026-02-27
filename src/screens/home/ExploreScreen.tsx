import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    FlatList,
    ActivityIndicator,
} from 'react-native';
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
                params: {
                    search: term,
                    ...(shopId && { shopId })
                },
            });
            setProducts(data);
        } catch (err) {
            console.error('Failed to fetch products', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(search);
    }, [shopId]);

    const handleSearch = (text: string) => {
        setSearch(text);
        // Debounce search in real app, simple fetch for now
        fetchProducts(text);
    };

    return (
        <View className="flex-1 bg-surface">
            <View className="bg-card px-6 pb-6 pt-14">
                <Text className="text-2xl font-bold text-white">Explore Items</Text>
                <View className="mt-4 flex-row items-center rounded-2xl bg-surface px-4 py-3">
                    <Text className="mr-2">🔍</Text>
                    <TextInput
                        className="flex-1 text-base text-white"
                        placeholder="Search products or shops..."
                        placeholderTextColor="#555"
                        value={search}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
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
                        <View className="mt-20 items-center">
                            <Text className="text-gray-500">No products found.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}
