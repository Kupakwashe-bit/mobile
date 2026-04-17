import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../lib/apiClient';

const TOKEN_KEY = 'vc_access_token';
const USER_KEY = 'vc_user';

interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthState {
    accessToken: string | null;
    user: User | null;
    isLoading: boolean;
    isHydrated: boolean;
    error: string | null;
    hydrate: () => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,
    isLoading: false,
    isHydrated: false,
    error: null,

    // Called once on app launch — reads persisted token from disk
    hydrate: async () => {
        try {
            const [token, userJson] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
            const storedToken = token[1];
            const storedUser: User | null = userJson[1] ? JSON.parse(userJson[1]) : null;
            set({ accessToken: storedToken, user: storedUser });
        } catch {
            // If storage read fails, stay logged out
        } finally {
            set({ isHydrated: true });
        }
    },

    register: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await apiClient.post('/api/v1/auth/register', { email, password });
            const user: User = { id: data.userId, email: data.email, role: data.role };
            await AsyncStorage.multiSet([
                [TOKEN_KEY, data.accessToken],
                [USER_KEY, JSON.stringify(user)],
            ]);
            set({ accessToken: data.accessToken, user, isLoading: false });
        } catch (err: any) {
            const message = err.response?.data?.message ?? 'Registration failed. Try again.';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await apiClient.post('/api/v1/auth/login', { email, password });
            const user: User = { id: data.userId, email: data.email, role: data.role };
            await AsyncStorage.multiSet([
                [TOKEN_KEY, data.accessToken],
                [USER_KEY, JSON.stringify(user)],
            ]);
            set({ accessToken: data.accessToken, user, isLoading: false });
        } catch (err: any) {
            const message = err.response?.data?.message ?? 'Login failed. Check your credentials.';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },

    logout: async () => {
        await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
        set({ accessToken: null, user: null });
    },
}));
