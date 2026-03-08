import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number | string;
        shop: { name: string };
    };
    onPress?: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
    const navigation = useNavigation<any>();

    const handlePress = () => {
        if (onPress) { onPress(); }
        else { navigation.navigate('ProductDetail', { productId: product.id }); }
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.card} activeOpacity={0.85}>
            <View style={styles.imageBox}>
                <Text style={styles.imageEmoji}>🛍️</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.shopName} numberOfLines={1}>{product.shop.name}</Text>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );
}

const C = { surface: '#0F0F0F', card: '#1A1A1A', brand: '#C0392B', white: '#FFFFFF' };

const styles = StyleSheet.create({
    card: { marginBottom: 16, width: '48%', borderRadius: 24, backgroundColor: C.card, overflow: 'hidden' },
    imageBox: { height: 160, width: '100%', backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
    imageEmoji: { fontSize: 36 },
    info: { padding: 12 },
    shopName: { fontSize: 12, fontWeight: '600', color: C.brand },
    productName: { marginTop: 4, fontSize: 14, fontWeight: 'bold', color: C.white },
    price: { marginTop: 4, fontSize: 16, fontWeight: 'bold', color: C.white },
});
