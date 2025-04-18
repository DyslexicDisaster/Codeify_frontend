import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN, GOOGLE_AUTH_URL, GITHUB_AUTH_URL } from "../constants";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
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
                localStorage.setItem(ACCESS_TOKEN, response.data.token);
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
            localStorage.removeItem(ACCESS_TOKEN);
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
            localStorage.setItem(ACCESS_TOKEN, token);
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
        const token = localStorage.getItem(ACCESS_TOKEN);
        return !!token;
    }
};

export default authService;