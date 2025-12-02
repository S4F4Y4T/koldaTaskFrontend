import api from './api';

/**
 * Task Service
 * Handles all task-related API calls
 */

export const taskService = {
    /**
     * Get all tasks
     * @returns {Promise} List of tasks
     */
    async getTasks() {
        const response = await api.get('/tasks');
        return response.data;
    },

    /**
     * Get a single task by ID
     * @param {number} id - Task ID
     * @returns {Promise} Task details
     */
    async getTask(id) {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    /**
     * Create a new task
     * @param {number} projectId - Project ID
     * @param {Object} data - Task data
     * @returns {Promise} Created task
     */
    async createTask(projectId, data) {
        const response = await api.post(`/projects/${projectId}/tasks`, data);
        return response.data;
    },

    /**
     * Update an existing task
     * @param {number} id - Task ID
     * @param {Object} data - Updated task data
     * @returns {Promise} Updated task
     */
    async updateTask(id, data) {
        const response = await api.put(`/tasks/${id}`, data);
        return response.data;
    },

    /**
     * Delete a task
     * @param {number} id - Task ID
     * @returns {Promise} Deletion response
     */
    async deleteTask(id) {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    }
};

export default taskService;
