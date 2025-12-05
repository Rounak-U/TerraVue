import axios from 'axios';

export const ADMIN_TOKEN_KEY = 'adminAccessToken';
const ADMIN_PROFILE_KEY = 'adminProfile';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const adminApi = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' }
});

adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            localStorage.removeItem(ADMIN_PROFILE_KEY);
        }
        return Promise.reject(error);
    }
);

export const persistAdminProfile = (profile = null) => {
    if (profile) {
        localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(profile));
    } else {
        localStorage.removeItem(ADMIN_PROFILE_KEY);
    }
};

export const getAdminProfile = () => {
    try {
        const raw = localStorage.getItem(ADMIN_PROFILE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        return null;
    }
};

export default adminApi;
