import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
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
        } catch (err) {
            console.error('Failed to fetch shops', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    return (
        <View className="flex-1 bg-surface">
            <View className="bg-card px-6 pb-6 pt-14 flex-row items-center justify-between">
                <View>
                    <Text className="text-2xl font-bold text-white">Local Shops</Text>
                    <Text className="text-sm text-gray-400">Discover vendors near you</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="h-10 w-10 items-center justify-center rounded-full bg-surface"
                >
                    <Text className="text-white font-bold">✕</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
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
                        <View className="mt-20 items-center">
                            <Text className="text-gray-500">No shops available right now.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}
