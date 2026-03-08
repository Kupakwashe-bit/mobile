import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ShopCardProps {
    shop: { id: string; name: string; ownerId: string; };
    onPress: () => void;
}

export default function ShopCard({ shop, onPress }: ShopCardProps) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.85}>
            <View style={styles.iconBox}>
                <Text style={styles.icon}>🏪</Text>
            </View>
            <View style={styles.textWrap}>
                <Text style={styles.name}>{shop.name}</Text>
                <Text style={styles.sub}>Vendor ID: {shop.ownerId.substring(0, 8)}...</Text>
            </View>
            <View style={styles.chevronBox}>
                <Text style={styles.chevron}>›</Text>
            </View>
        </TouchableOpacity>
    );
}

const C = { surface: '#0F0F0F', card: '#1A1A1A', brand: '#C0392B', white: '#FFFFFF', gray400: '#9CA3AF' };

const styles = StyleSheet.create({
    card: { marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderRadius: 24, backgroundColor: C.card, padding: 16 },
    iconBox: { height: 64, width: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: C.surface },
    icon: { fontSize: 28 },
    textWrap: { marginLeft: 16, flex: 1 },
    name: { fontSize: 16, fontWeight: 'bold', color: C.white },
    sub: { fontSize: 12, color: C.gray400 },
    chevronBox: { marginLeft: 8, height: 40, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: C.surface },
    chevron: { fontSize: 20, color: C.brand },
});
