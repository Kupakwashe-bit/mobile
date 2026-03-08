import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ActivityIndicator,
    Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth.store';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
    const navigation = useNavigation<Nav>();
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) { Alert.alert('Error', 'Please fill in all fields.'); return; }
        try { await login(email, password); } catch (err: any) { Alert.alert('Login Failed', err.message); }
    };

    return (
        <KeyboardAvoidingView
            style={styles.root}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={styles.inner}>
                    {/* Logo */}
                    <View style={styles.logoWrap}>
                        <View style={styles.logoBox}>
                            <Text style={styles.logoChar}>V</Text>
                        </View>
                        <Text style={styles.appName}>VenCapital</Text>
                        <Text style={styles.appSub}>Your multi-vendor marketplace</Text>
                    </View>

                    {/* Form Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Welcome back</Text>

                        <View style={styles.fieldWrap}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor="#555"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <View style={styles.fieldWrapLast}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#555"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={handleLogin}
                            disabled={isLoading}
                            activeOpacity={0.85}
                        >
                            {isLoading
                                ? <ActivityIndicator color="#fff" />
                                : <Text style={styles.submitText}>Sign In</Text>
                            }
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.footerLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const C = { surface: '#0F0F0F', card: '#1A1A1A', border: '#2A2A2A', brand: '#C0392B', white: '#FFFFFF', gray400: '#9CA3AF' };

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.surface },
    inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 48 },
    logoWrap: { marginBottom: 48, alignItems: 'center' },
    logoBox: { marginBottom: 16, height: 80, width: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: C.brand },
    logoChar: { fontSize: 36, fontWeight: 'bold', color: C.white },
    appName: { fontSize: 36, fontWeight: 'bold', color: C.white },
    appSub: { marginTop: 8, fontSize: 16, color: C.gray400 },
    card: { borderRadius: 24, backgroundColor: C.card, padding: 24 },
    cardTitle: { marginBottom: 24, fontSize: 22, fontWeight: 'bold', color: C.white },
    fieldWrap: { marginBottom: 16 },
    fieldWrapLast: { marginBottom: 24 },
    label: { marginBottom: 8, fontSize: 14, fontWeight: '500', color: C.gray400 },
    input: { borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: C.white },
    submitBtn: { alignItems: 'center', borderRadius: 12, backgroundColor: C.brand, paddingVertical: 16 },
    submitText: { fontSize: 16, fontWeight: 'bold', color: C.white },
    footer: { marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    footerText: { color: C.gray400 },
    footerLink: { fontWeight: '600', color: C.brand },
});
