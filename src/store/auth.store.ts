import { create } from 'zustand';
import apiClient from '../lib/apiClient';

interface AuthState {
    accessToken: string | null;
    user: { id: string; email: string; role: string } | null;
    isLoading: boolean;
    error: string | null;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,
    isLoading: false,
    error: null,

    register: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await apiClient.post('/api/v1/auth/register', {
                email,
                password,
            });
            set({
                accessToken: data.accessToken,
                user: { id: data.userId, email: data.email, role: data.role },
                isLoading: false,
            });
        } catch (err: any) {
            const message =
                err.response?.data?.message ?? 'Registration failed. Try again.';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await apiClient.post('/api/v1/auth/login', {
                email,
                password,
            });
            set({
                accessToken: data.accessToken,
                user: { id: data.userId, email: data.email, role: data.role },
                isLoading: false,
            });
        } catch (err: any) {
            const message =
                err.response?.data?.message ?? 'Login failed. Check your credentials.';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },

    logout: () => set({ accessToken: null, user: null }),
}));
