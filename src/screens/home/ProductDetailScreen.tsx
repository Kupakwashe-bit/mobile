import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import apiClient from '../../lib/apiClient';
import { useCartStore } from '../../store/cart.store';

export default function ProductDetailScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { productId } = route.params;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await apiClient.get(`/api/v1/products/${productId}`);
                setProduct(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchProduct();
    }, [productId]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#C0392B" />
            </View>
        );
    }
    if (!product) {
        return (
            <View style={styles.centered}>
                <Text style={styles.notFound}>Product not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <ScrollView>
                <View style={styles.imageBox}>
                    <Text style={styles.imageEmoji}>🛍️</Text>
                </View>

                <View style={styles.details}>
                    <Text style={styles.shopName}>{product.shop.name}</Text>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>

                    <View style={styles.descSection}>
                        <Text style={styles.descTitle}>Description</Text>
                        <Text style={styles.descText}>
                            {product.description || 'No description provided for this premium item.'}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.addToCartBtn}
                    activeOpacity={0.9}
                    onPress={() => {
                        addItem(product, product.shop);
                        navigation.navigate('HomeTabs', { screen: 'Cart' });
                    }}
                >
                    <Text style={styles.cartIcon}>🛒</Text>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const C = { surface: '#0F0F0F', card: '#1A1A1A', border: '#2A2A2A', brand: '#C0392B', white: '#FFFFFF', gray400: '#9CA3AF' };

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.surface },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface },
    notFound: { color: C.white, fontSize: 16 },
    imageBox: { height: 320, width: '100%', backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
    imageEmoji: { fontSize: 80 },
    details: { padding: 24 },
    shopName: { fontSize: 14, fontWeight: '600', color: C.brand, textTransform: 'uppercase', letterSpacing: 1 },
    productName: { marginTop: 8, fontSize: 28, fontWeight: 'bold', color: C.white },
    price: { marginTop: 12, fontSize: 24, fontWeight: 'bold', color: C.white },
    descSection: { marginTop: 24, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 24 },
    descTitle: { fontSize: 18, fontWeight: 'bold', color: C.white },
    descText: { marginTop: 8, fontSize: 16, lineHeight: 24, color: C.gray400 },
    footer: { borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.card, paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 32 },
    addToCartBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: C.brand, paddingVertical: 16 },
    cartIcon: { fontSize: 20, marginRight: 8 },
    addToCartText: { fontSize: 18, fontWeight: 'bold', color: C.white },
});
