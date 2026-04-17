import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const { user, logout } = useAuthStore();
    const navigation = useNavigation<any>();

    const handleActionPress = (label: string) => {
        switch (label) {
            case 'Shops': navigation.navigate('Shops'); break;
            case 'Cart': navigation.navigate('Cart'); break;
            case 'Explore': navigation.navigate('Explore'); break;
            case 'Profile': navigation.navigate('Profile'); break;
            case 'Orders': navigation.navigate('OrderHistory'); break;
            case 'Admin': navigation.navigate('AdminDashboard'); break;
            default: break;
        }
    };

    return (
        <View style={styles.root}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.welcomeLabel}>Welcome back,</Text>
                            <Text style={styles.userName}>
                                {user?.email?.split('@')[0] ?? 'User'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => logout()} style={styles.logoutBtn}>
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Hero Banner */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Explore')}
                    activeOpacity={0.9}
                    style={styles.heroBanner}
                >
                    <Text style={styles.heroEyebrow}>VenCapital Marketplace</Text>
                    <Text style={styles.heroTitle}>Discover Local Shops & Vendors</Text>
                    <Text style={styles.heroSub}>Order from hundreds of vendors near you</Text>
                    <View style={styles.heroBtn}>
                        <Text style={styles.heroBtnText}>Explore Now</Text>
                    </View>
                </TouchableOpacity>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsRow}>
                        {QUICK_ACTIONS.map((action) => (
                            <TouchableOpacity
                                key={action.label}
                                onPress={() => handleActionPress(action.label)}
                                style={styles.actionCard}
                            >
                                <Text style={styles.actionIcon}>{action.icon}</Text>
                                <Text style={styles.actionLabel}>{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Coming Soon */}
                <View style={styles.comingSoon}>
                    <Text style={styles.comingSoonEyebrow}>Sprint 2 Coming Soon</Text>
                    <Text style={styles.comingSoonTitle}>Shop Directory & Search</Text>
                    <Text style={styles.comingSoonSub}>
                        Browse nearby shops, filter by category, and search products.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const QUICK_ACTIONS = [
    { icon: '🏪', label: 'Shops' },
    { icon: '🛒', label: 'Cart' },
    { icon: '📦', label: 'Orders' },
    { icon: '🛡️', label: 'Admin' },
];

const COLORS = {
    surface: '#0F0F0F',
    card: '#1A1A1A',
    border: '#2A2A2A',
    brand: '#C0392B',
    white: '#FFFFFF',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    red100: '#FEE2E2',
    red200: '#FECACA',
};

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: COLORS.surface },
    header: { backgroundColor: COLORS.card, paddingHorizontal: 24, paddingBottom: 24, paddingTop: 56 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    welcomeLabel: { fontSize: 14, color: COLORS.gray400 },
    userName: { fontSize: 20, fontWeight: 'bold', color: COLORS.white },
    logoutBtn: { borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 16, paddingVertical: 8 },
    logoutText: { fontSize: 14, fontWeight: '500', color: COLORS.gray300 },
    heroBanner: { marginHorizontal: 24, marginTop: 24, borderRadius: 24, backgroundColor: COLORS.brand, padding: 24, overflow: 'hidden' },
    heroEyebrow: { fontSize: 12, fontWeight: '600', color: COLORS.red200, textTransform: 'uppercase', letterSpacing: 2 },
    heroTitle: { marginTop: 8, fontSize: 22, fontWeight: 'bold', color: COLORS.white },
    heroSub: { marginTop: 8, fontSize: 14, color: COLORS.red100 },
    heroBtn: { marginTop: 16, alignSelf: 'flex-start', borderRadius: 12, backgroundColor: COLORS.white, paddingHorizontal: 20, paddingVertical: 10 },
    heroBtnText: { fontWeight: 'bold', color: COLORS.brand },
    section: { marginHorizontal: 24, marginTop: 24 },
    sectionTitle: { marginBottom: 16, fontSize: 18, fontWeight: 'bold', color: COLORS.white },
    actionsRow: { flexDirection: 'row', gap: 12 },
    actionCard: { flex: 1, alignItems: 'center', borderRadius: 16, backgroundColor: COLORS.card, padding: 16 },
    actionIcon: { fontSize: 28 },
    actionLabel: { marginTop: 8, textAlign: 'center', fontSize: 12, fontWeight: '500', color: COLORS.gray300 },
    comingSoon: { marginHorizontal: 24, marginTop: 24, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.card, padding: 16 },
    comingSoonEyebrow: { fontSize: 12, fontWeight: '600', color: COLORS.brand, textTransform: 'uppercase', letterSpacing: 1 },
    comingSoonTitle: { marginTop: 4, fontSize: 16, fontWeight: '600', color: COLORS.white },
    comingSoonSub: { marginTop: 4, fontSize: 14, color: COLORS.gray400 },
});
