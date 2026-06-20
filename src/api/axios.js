import axios from "axios";

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://onyxfitbackend.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - automatically add token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle 401 errors (token expired/invalid)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid - clear auth data and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;