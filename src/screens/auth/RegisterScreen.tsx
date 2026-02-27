import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth.store';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
    const navigation = useNavigation<Nav>();
    const { register, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const handleRegister = async () => {
        if (!email || !password || !confirm) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        if (password !== confirm) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters.');
            return;
        }
        try {
            await register(email, password);
        } catch (err: any) {
            Alert.alert('Registration Failed', err.message);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-surface"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 justify-center px-6 pb-12">
                    {/* Header */}
                    <View className="mb-10 items-center">
                        <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-brand">
                            <Text className="text-4xl font-bold text-white">V</Text>
                        </View>
                        <Text className="text-3xl font-bold tracking-tight text-white">
                            Create Account
                        </Text>
                        <Text className="mt-2 text-base text-gray-400">
                            Join the marketplace today
                        </Text>
                    </View>

                    {/* Form Card */}
                    <View className="rounded-3xl bg-card p-6 shadow-lg">
                        <View className="mb-4">
                            <Text className="mb-2 text-sm font-medium text-gray-400">
                                Email
                            </Text>
                            <TextInput
                                className="rounded-xl border border-border bg-surface px-4 py-3.5 text-base text-white"
                                placeholder="you@example.com"
                                placeholderTextColor="#555"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="mb-2 text-sm font-medium text-gray-400">
                                Password
                            </Text>
                            <TextInput
                                className="rounded-xl border border-border bg-surface px-4 py-3.5 text-base text-white"
                                placeholder="Min. 8 characters"
                                placeholderTextColor="#555"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="mb-2 text-sm font-medium text-gray-400">
                                Confirm Password
                            </Text>
                            <TextInput
                                className="rounded-xl border border-border bg-surface px-4 py-3.5 text-base text-white"
                                placeholder="••••••••"
                                placeholderTextColor="#555"
                                secureTextEntry
                                value={confirm}
                                onChangeText={setConfirm}
                            />
                        </View>

                        <TouchableOpacity
                            className="items-center rounded-xl bg-brand py-4"
                            onPress={handleRegister}
                            disabled={isLoading}
                            activeOpacity={0.85}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-base font-bold text-white">
                                    Create Account
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View className="mt-6 flex-row items-center justify-center">
                        <Text className="text-gray-400">Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text className="font-semibold text-brand">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
