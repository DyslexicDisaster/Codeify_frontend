import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL, GOOGLE_AUTH_URL, GITHUB_AUTH_URL } from "../constants";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
});

apiClient.interceptors.request.use((config) => {
    const token = Cookies.get('jwtToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const toFormData = (data) => {
    const params = new URLSearchParams();
    Object.keys(data).forEach((key) => {
        params.append(key, data[key]);
    });
    return params;
};

export const authService = {
    registerUser: async (userData) => {
        try {
            const response = await apiClient.post("/api/user/register", toFormData(userData));
            return response.data;
        } catch (error) {
            console.error('Registration Error:', error);
            throw error.response?.data || error.message;
        }
    },

    loginUser: async (credentials) => {
        try {
            const response = await apiClient.post("/api/user/login", toFormData(credentials));
            if (response.data.token) {
                Cookies.set('jwtToken', response.data.token, { expires: 1, sameSite: 'Lax' });
            }
            return response.data;
        } catch (error) {
            console.error('Login Error:', error);
            throw error.response?.data || error.message;
        }
    },

    logoutUser: async () => {
        try {
            const response = await apiClient.get("/api/user/logout");
            Cookies.remove('jwtToken');
            return response.data;
        } catch (error) {
            console.error('Logout Error:', error);
            throw error.response?.data || error.message;
        }
    },

    initiateOAuthLogin: (provider) => {
        const authUrl = provider === 'google' ? GOOGLE_AUTH_URL : GITHUB_AUTH_URL;
        window.location.href = authUrl;
    },

    handleOAuthCallback: async () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            if (!token) {
                throw new Error('Authentication failed: No token received');
            }
            Cookies.set('jwtToken', token, { expires: 1, sameSite: 'Lax' });
            window.history.replaceState({}, document.title, window.location.pathname);
            return await authService.getCurrentUser();
        } catch (error) {
            console.error('OAuth Callback Error:', error);
            throw error;
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await apiClient.get("/api/user/me");
            return response.data;
        } catch (error) {
            console.error('Get User Error:', error);
            return null;
        }
    },

    isAuthenticated: () => {
        const token = Cookies.get('jwtToken');
        return !!token;
    }
};

export default authService;