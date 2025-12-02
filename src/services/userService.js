import api from './api';

/**
 * User Service
 * Handles all user-related API calls
 */

export const userService = {
    /**
     * Get all users with optional filters
     * @param {Object} params - Query parameters { page, sort, name }
     * @returns {Promise} Paginated list of users
     */
    async getUsers(params = {}) {
        const response = await api.get('/users', { params });
        return response.data;
    },

    /**
     * Get a single user by ID
     * @param {number} id - User ID
     * @returns {Promise} User details
     */
    async getUser(id) {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    /**
     * Create a new user
     * @param {Object} data - User data { name, email, password }
     * @returns {Promise} Created user
     */
    async createUser(data) {
        const response = await api.post('/users', data);
        return response.data;
    },

    /**
     * Update an existing user
     * @param {number} id - User ID
     * @param {Object} data - Updated user data { name, email, password? }
     * @returns {Promise} Updated user
     */
    async updateUser(id, data) {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },

    /**
     * Delete a user
     * @param {number} id - User ID
     * @returns {Promise} Deletion response
     */
    async deleteUser(id) {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};

export default userService;
