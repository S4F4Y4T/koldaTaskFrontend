<script setup>
import { ref, onMounted } from 'vue';

import projectService from '../services/projectService';
import { handleServerErrors, getErrorMessage } from '../utils/validation';

const projects = ref([]);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const showDeleteDialog = ref(false);
const modalMode = ref('create'); // 'create' or 'edit'
const currentProject = ref(null);

const formData = ref({
  title: '',
  client: '',
  start_date: '',
  end_date: '',
  status: 'pending'
});

const errors = ref({
  title: '',
  client: '',
  start_date: '',
  end_date: ''
});

const validateForm = () => {
  let isValid = true;
  errors.value = { title: '', client: '', start_date: '', end_date: '' };

  if (!formData.value.title.trim()) {
    errors.value.title = 'Title is required';
    isValid = false;
  }

  if (!formData.value.client.trim()) {
    errors.value.client = 'Client is required';
    isValid = false;
  }

  if (!formData.value.start_date) {
    errors.value.start_date = 'Start date is required';
    isValid = false;
  }

  if (!formData.value.end_date) {
    errors.value.end_date = 'End date is required';
    isValid = false;
  } else if (formData.value.start_date && formData.value.end_date < formData.value.start_date) {
    errors.value.end_date = 'End date must be after start date';
    isValid = false;
  }

  return isValid;
};

const fetchProjects = async () => {
  try {
    loading.value = true;
    const response = await projectService.getProjects();
    projects.value = response.data || [];
  } catch (err) {
    error.value = 'Failed to load projects';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Modal handlers
const openCreateModal = () => {
  modalMode.value = 'create';
  formData.value = {
    title: '',
    client: '',
    start_date: '',
    end_date: '',
    status: 'pending'
  };
  showModal.value = true;
};

const openEditModal = (project) => {
  modalMode.value = 'edit';
  currentProject.value = project;
  formData.value = {
    title: project.title,
    client: project.client,
    start_date: project.start_date ? project.start_date.split('T')[0] : '',
    end_date: project.end_date ? project.end_date.split('T')[0] : '',
    status: project.status
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentProject.value = null;
  formData.value = {
    title: '',
    client: '',
    start_date: '',
    end_date: '',
    status: 'pending'
  };
  errors.value = { title: '', client: '', start_date: '', end_date: '' };
};

const openDeleteDialog = (project, event) => {
  event.stopPropagation(); // Prevent triggering row click
  currentProject.value = project;
  showDeleteDialog.value = true;
};

const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  currentProject.value = null;
};

// CRUD operations
const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    if (modalMode.value === 'create') {
      await projectService.createProject(formData.value);
    } else {
      await projectService.updateProject(currentProject.value.id, formData.value);
    }
    await fetchProjects();
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
    await projectService.deleteProject(currentProject.value.id);
    await fetchProjects();
    closeDeleteDialog();
  } catch (err) {
    error.value = 'Failed to delete project';
    console.error(err);
  }
};

onMounted(() => {
  fetchProjects();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Projects</h2>
        <p class="text-slate-500 text-sm mt-1">Manage your ongoing projects and track progress.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 font-medium flex items-center justify-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Project
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="error" class="text-center py-10 text-red-600 bg-red-50 rounded-lg border border-red-100">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="project in projects" 
        :key="project.id" 
        @click="openEditModal(project)"
        class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-200 group cursor-pointer relative"
      >
        <!-- Delete Button (Absolute) -->
        <button 
          @click="(e) => openDeleteDialog(project, e)"
          class="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-1"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-200">
            {{ project.title.charAt(0) }}
          </div>
          <span class="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full capitalize mr-8"
            :class="{
              'bg-emerald-50 text-emerald-700 border border-emerald-100': project.status === 'completed',
              'bg-blue-50 text-blue-700 border border-blue-100': project.status === 'in_progress',
              'bg-amber-50 text-amber-700 border border-amber-100': project.status === 'pending',
              'bg-red-50 text-red-700 border border-red-100': project.status === 'cancelled'
            }">
            {{ project.status.replace('_', ' ') }}
          </span>
        </div>
        
        <h3 class="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{{ project.title }}</h3>
        <p class="text-sm text-slate-500 mb-4">{{ project.client }}</p>
        
        <div class="space-y-3">
          <div class="flex justify-between text-xs text-slate-500">
            <span>Progress</span>
            <span class="font-medium text-slate-700">{{ Math.round(project.completion_percentage || 0) }}%</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              class="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
              :style="{ width: `${project.completion_percentage || 0}%` }"
            ></div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
          
          <div class="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded">
            Due {{ new Date(project.end_date).toLocaleDateString() }}
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="projects.length === 0" class="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-slate-300">
        <div class="mx-auto h-12 w-12 text-slate-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 class="mt-2 text-sm font-medium text-slate-900">No projects</h3>
        <p class="mt-1 text-sm text-slate-500">Get started by creating a new project.</p>
        <div class="mt-6">
          <button 
            @click="openCreateModal"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            New Project
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-slate-200">
          <h3 class="text-lg font-bold text-slate-800">
            {{ modalMode === 'create' ? 'Create New Project' : 'Edit Project' }}
          </h3>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              v-model="formData.title"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Project Title"
            />
            <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Client</label>
            <input
              v-model="formData.client"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Client Name"
            />
            <p v-if="errors.client" class="text-red-500 text-xs mt-1">{{ errors.client }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input
                v-model="formData.start_date"
                type="date"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p v-if="errors.start_date" class="text-red-500 text-xs mt-1">{{ errors.start_date }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input
                v-model="formData.end_date"
                type="date"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p v-if="errors.end_date" class="text-red-500 text-xs mt-1">{{ errors.end_date }}</p>
            </div>
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
          <h3 class="text-lg font-bold text-slate-800">Delete Project</h3>
        </div>
        <div class="px-6 py-4">
          <p class="text-slate-600">
            Are you sure you want to delete <strong>{{ currentProject?.title }}</strong>? This action cannot be undone.
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
