import api from './api';

/**
 * Project Service
 * Handles all project-related API calls
 */

export const projectService = {
    /**
     * Get all projects
     * @returns {Promise} List of projects
     */
    async getProjects() {
        const response = await api.get('/projects');
        return response.data;
    },

    /**
     * Get a single project by ID
     * @param {number} id - Project ID
     * @returns {Promise} Project details
     */
    async getProject(id) {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    /**
     * Create a new project
     * @param {Object} data - Project data
     * @returns {Promise} Created project
     */
    async createProject(data) {
        const response = await api.post('/projects', data);
        return response.data;
    },

    /**
     * Update an existing project
     * @param {number} id - Project ID
     * @param {Object} data - Updated project data
     * @returns {Promise} Updated project
     */
    async updateProject(id, data) {
        const response = await api.put(`/projects/${id}`, data);
        return response.data;
    },

    /**
     * Delete a project
     * @param {number} id - Project ID
     * @returns {Promise} Deletion response
     */
    async deleteProject(id) {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    }
};

export default projectService;
