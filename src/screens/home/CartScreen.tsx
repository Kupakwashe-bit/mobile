import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useCartStore } from '../../store/cart.store';
import apiClient from '../../lib/apiClient';

export default function CartScreen() {
    const { items, total, updateQuantity, removeItem, clearCart } = useCartStore();
    const [loading, setLoading] = React.useState(false);

    const handleCheckout = async () => {
        if (items.length === 0) return;
        setLoading(true);
        try {
            const shopId = items[0].shopId;
            const orderItems = items
                .filter((i) => i.shopId === shopId)
                .map((i) => ({ productId: i.productId, quantity: i.quantity }));
            await apiClient.post('/api/v1/orders', { shopId, items: orderItems });
            alert('Order placed successfully!');
            clearCart();
        } catch (err: any) {
            alert('Checkout failed: ' + (err.response?.data?.message ?? 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <View style={styles.emptyRoot}>
                <Text style={styles.emptyIcon}>🛒</Text>
                <Text style={styles.emptyTitle}>Your cart is empty</Text>
                <Text style={styles.emptySub}>Looks like you haven't added anything to your cart yet.</Text>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Shopping Cart</Text>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.productId}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <View style={styles.itemIconBox}>
                            <Text style={styles.itemIcon}>📦</Text>
                        </View>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemShop}>{item.shopName}</Text>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                        <View style={styles.qtyWrap}>
                            <View style={styles.qtyRow}>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.productId, item.quantity - 1)}
                                    style={styles.qtyBtn}
                                >
                                    <Text style={styles.qtyBtnText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.qtyNum}>{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                                    style={styles.qtyBtn}
                                >
                                    <Text style={styles.qtyBtnText}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => removeItem(item.productId)} style={styles.removeBtn}>
                                <Text style={styles.removeText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    style={styles.checkoutBtn}
                    activeOpacity={0.85}
                    onPress={handleCheckout}
                    disabled={loading}
                >
                    <Text style={styles.checkoutText}>
                        {loading ? 'Processing...' : 'Checkout Now'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const C = { surface: '#0F0F0F', card: '#1A1A1A', border: '#2A2A2A', brand: '#C0392B', white: '#FFFFFF', gray400: '#9CA3AF', gray500: '#6B7280' };

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.surface },
    emptyRoot: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface, paddingHorizontal: 24 },
    emptyIcon: { fontSize: 64, marginBottom: 16 },
    emptyTitle: { fontSize: 24, fontWeight: 'bold', color: C.white },
    emptySub: { marginTop: 8, textAlign: 'center', color: C.gray400 },
    header: { backgroundColor: C.card, paddingHorizontal: 24, paddingBottom: 24, paddingTop: 56 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: C.white },
    cartItem: { marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderRadius: 16, backgroundColor: C.card, padding: 16 },
    itemIconBox: { height: 64, width: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: C.surface },
    itemIcon: { fontSize: 24 },
    itemInfo: { marginLeft: 16, flex: 1 },
    itemShop: { fontSize: 14, fontWeight: '600', color: C.brand },
    itemName: { fontSize: 16, fontWeight: 'bold', color: C.white },
    itemPrice: { marginTop: 4, fontSize: 18, fontWeight: 'bold', color: C.white },
    qtyWrap: { alignItems: 'center' },
    qtyRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, backgroundColor: C.surface, paddingHorizontal: 8, paddingVertical: 4 },
    qtyBtn: { height: 32, width: 32, alignItems: 'center', justifyContent: 'center' },
    qtyBtnText: { fontSize: 20, color: C.brand },
    qtyNum: { marginHorizontal: 12, fontWeight: 'bold', color: C.white },
    removeBtn: { marginTop: 8 },
    removeText: { fontSize: 12, color: C.gray500 },
    footer: { borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.card, padding: 24, paddingBottom: 32 },
    totalRow: { marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    totalLabel: { fontSize: 18, color: C.gray400 },
    totalAmount: { fontSize: 24, fontWeight: 'bold', color: C.white },
    checkoutBtn: { alignItems: 'center', borderRadius: 16, backgroundColor: C.brand, paddingVertical: 16 },
    checkoutText: { fontSize: 18, fontWeight: 'bold', color: C.white },
});
