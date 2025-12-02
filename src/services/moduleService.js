import api from './api';

/**
 * Module Service
 * Handles module and permission-related API calls
 */

export const moduleService = {
    /**
     * Get all modules with their permissions
     * Returns modules grouped with their associated permissions
     * @returns {Promise} List of modules with permissions
     */
    async getModules() {
        const response = await api.get('/modules');
        return response.data;
    }
};

export default moduleService;
