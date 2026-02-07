import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8000', // Adjust if backend runs on a different port
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token expired or invalid
            if (typeof window !== 'undefined') {
                // Prevent infinite loop if already on login
                if (!window.location.pathname.includes('/auth/login')) {
                    localStorage.removeItem('token');
                    window.location.href = '/auth/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

// Forgot Password API call
export const forgotPassword = async (email: string) => {
    try {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;
