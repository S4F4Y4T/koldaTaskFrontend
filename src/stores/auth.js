import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('access_token') || null,
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        currentUser: (state) => state.user,
    },

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post('/login', credentials);
                const { access_token, user } = response.data.data;

                this.token = access_token;
                this.user = user;

                localStorage.setItem('access_token', access_token);
                localStorage.setItem('user', JSON.stringify(user));

                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Login failed';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                await api.post('/logout');
            } catch (error) {
                console.error('Logout error', error);
            } finally {
                this.token = null;
                this.user = null;
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
            }
        },

        async fetchProfile() {
            try {
                const response = await api.get('/me');
                this.user = response.data.data;
                localStorage.setItem('user', JSON.stringify(this.user));
            } catch (error) {
                console.error('Fetch profile error', error);
            }
        }
    },
});
