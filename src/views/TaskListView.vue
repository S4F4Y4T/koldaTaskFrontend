<script setup>
import { ref, onMounted } from 'vue';
import taskService from '../services/taskService';
import projectService from '../services/projectService';
import userService from '../services/userService';
import { handleServerErrors, getErrorMessage } from '../utils/validation';

const tasks = ref([]);
const projects = ref([]);
const users = ref([]);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const showDeleteDialog = ref(false);
const modalMode = ref('create'); // 'create' or 'edit'
const currentTask = ref(null);

const formData = ref({
  title: '',
  description: '',
  status: 'pending',
  deadline: '',
  project_id: '',
  assigned_user_id: ''
});

const errors = ref({
  title: '',
  description: '',
  project_id: '',
  deadline: ''
});

const validateForm = () => {
  let isValid = true;
  errors.value = { title: '', project_id: '', deadline: '' };

  if (!formData.value.title.trim()) {
    errors.value.title = 'Title is required';
    isValid = false;
  }

  if (!formData.value.description.trim()) {
    errors.value.description = 'Description is required';
    isValid = false;
  }

  if (!formData.value.project_id) {
    errors.value.project_id = 'Project is required';
    isValid = false;
  }

  if (!formData.value.deadline) {
    errors.value.deadline = 'Deadline is required';
    isValid = false;
  }

  return isValid;
};

const fetchTasks = async () => {
  try {
    loading.value = true;
    const response = await taskService.getTasks();
    tasks.value = response.data || [];
  } catch (err) {
    error.value = 'Failed to load tasks';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const fetchProjects = async () => {
  try {
    const response = await projectService.getProjects();
    projects.value = response.data || [];
  } catch (err) {
    console.error('Failed to load projects:', err);
  }
};

const fetchUsers = async () => {
  try {
    const response = await userService.getUsers();
    users.value = response.data || [];
  } catch (err) {
    console.error('Failed to load users:', err);
  }
};

// Modal handlers
const openCreateModal = () => {
  modalMode.value = 'create';
  formData.value = {
    title: '',
    description: '',
    status: 'pending',
    deadline: '',
    project_id: '',
    assigned_user_id: ''
  };
  showModal.value = true;
};

const openEditModal = (task) => {
  modalMode.value = 'edit';
  currentTask.value = task;
  formData.value = {
    title: task.title,
    description: task.description || '',
    status: task.status,
    deadline: task.deadline ? task.deadline.split('T')[0] : '',
    project_id: task.project?.id || '',
    assigned_user_id: task.assigned_user?.id || ''
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentTask.value = null;
  formData.value = {
    title: '',
    description: '',
    status: 'pending',
    deadline: '',
    project_id: '',
    assigned_user_id: ''
  };
  errors.value = { title: '', description: '', project_id: '', deadline: '' };
};

const openDeleteDialog = (task, event) => {
  event.stopPropagation();
  currentTask.value = task;
  showDeleteDialog.value = true;
};

const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  currentTask.value = null;
};

// CRUD operations
const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    if (modalMode.value === 'create') {
      // For create, we need project_id in the URL
      await taskService.createTask(formData.value.project_id, formData.value);
    } else {
      await taskService.updateTask(currentTask.value.id, formData.value);
    }
    await fetchTasks();
    closeModal();
  } catch (err) {
    if (!handleServerErrors(err, errors)) {
      error.value = getErrorMessage(err);
      console.error(err);
    }
  }
};

const handleDelete = async () => {
  try {
    await taskService.deleteTask(currentTask.value.id);
    await fetchTasks();
    closeDeleteDialog();
  } catch (err) {
    error.value = 'Failed to delete task';
    console.error(err);
  }
};

onMounted(() => {
  fetchTasks();
  fetchProjects();
  fetchUsers();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Tasks</h2>
        <p class="text-slate-500 text-sm mt-1">Track and manage your team's tasks.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 font-medium flex items-center justify-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Task
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="error" class="text-center py-10 text-red-600 bg-red-50 rounded-lg border border-red-100">
      {{ error }}
    </div>

    <div v-else class="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Task</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Deadline</th>
              <th scope="col" class="relative px-6 py-4">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr 
              v-for="task in tasks" 
              :key="task.id" 
              @click="openEditModal(task)"
              class="hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{{ task.title }}</div>
                    <div class="text-xs text-slate-500">ID: #{{ task.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-600">{{ task.project?.title || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full capitalize"
                  :class="{
                    'bg-emerald-50 text-emerald-700 border border-emerald-100': task.status === 'completed',
                    'bg-blue-50 text-blue-700 border border-blue-100': task.status === 'in_progress',
                    'bg-amber-50 text-amber-700 border border-amber-100': task.status === 'pending',
                    'bg-red-50 text-red-700 border border-red-100': task.status === 'cancelled'
                  }">
                  {{ task.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-600">{{ new Date(task.deadline).toLocaleDateString() }}</div>
                <div v-if="task.is_overdue" class="text-xs text-red-500 font-medium mt-0.5">Overdue</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="(e) => openDeleteDialog(task, e)"
                  class="text-slate-400 hover:text-red-600 transition-colors"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="tasks.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-slate-500">
                No tasks found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-slate-200">
          <h3 class="text-lg font-bold text-slate-800">
            {{ modalMode === 'create' ? 'Create New Task' : 'Edit Task' }}
          </h3>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              v-model="formData.title"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Task Title"
            />
            <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Task Description"
            ></textarea>
            <p v-if="errors.description" class="text-red-500 text-xs mt-1">{{ errors.description }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Project</label>
              <select
                v-model="formData.project_id"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                :disabled="modalMode === 'edit'"
              >
                <option value="" disabled>Select Project</option>
                <option v-for="project in projects" :key="project.id" :value="project.id">
                  {{ project.title }}
                </option>
              </select>
              <p v-if="errors.project_id" class="text-red-500 text-xs mt-1">{{ errors.project_id }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Assigned User</label>
              <select
                v-model="formData.assigned_user_id"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>Select User</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
              <input
                v-model="formData.deadline"
                type="date"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p v-if="errors.deadline" class="text-red-500 text-xs mt-1">{{ errors.deadline }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                v-model="formData.status"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            @click="closeModal"
            class="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {{ modalMode === 'create' ? 'Create' : 'Update' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteDialog" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-slate-200">
          <h3 class="text-lg font-bold text-slate-800">Delete Task</h3>
        </div>
        <div class="px-6 py-4">
          <p class="text-slate-600">
            Are you sure you want to delete <strong>{{ currentTask?.title }}</strong>? This action cannot be undone.
          </p>
        </div>
        <div class="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            @click="closeDeleteDialog"
            class="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
