import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:6000/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // For refresh token cookie
});

// Request interceptor to add access token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                // Note: The refresh endpoint expects the refresh_token cookie, which is sent automatically with withCredentials: true
                const response = await axios.post('http://localhost:6000/api/v1/refresh', {}, {
                    withCredentials: true
                });

                const { access_token } = response.data.data;

                localStorage.setItem('access_token', access_token);

                // Update header and retry original request
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
