import api from './api';

/**
 * Role Service
 * Handles all role-related API calls
 */

export const roleService = {
    /**
     * Get all roles
     * @returns {Promise} List of roles
     */
    async getRoles() {
        const response = await api.get('/roles');
        return response.data;
    },

    /**
     * Get a single role by ID
     * @param {number} id - Role ID
     * @returns {Promise} Role details
     */
    async getRole(id) {
        const response = await api.get(`/roles/${id}`);
        return response.data;
    },

    /**
     * Create a new role
     * @param {Object} data - Role data { name, description }
     * @returns {Promise} Created role
     */
    async createRole(data) {
        const response = await api.post('/roles', data);
        return response.data;
    },

    /**
     * Update an existing role
     * @param {number} id - Role ID
     * @param {Object} data - Updated role data { name, description }
     * @returns {Promise} Updated role
     */
    async updateRole(id, data) {
        const response = await api.put(`/roles/${id}`, data);
        return response.data;
    },

    /**
     * Delete a role
     * @param {number} id - Role ID
     * @returns {Promise} Deletion response
     */
    async deleteRole(id) {
        const response = await api.delete(`/roles/${id}`);
        return response.data;
    },

    /**
     * Assign permissions to a role
     * @param {number} roleId - Role ID
     * @param {Array<string>} permissions - Array of permission names
     * @returns {Promise} Updated role with permissions
     */
    async assignPermissions(roleId, permissions) {
        const response = await api.post(`/roles/${roleId}/permissions/assign`, {
            permissions
        });
        return response.data;
    }
};

export default roleService;
