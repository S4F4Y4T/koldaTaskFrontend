<script setup>

import { ref, onMounted, watch } from 'vue';
import userService from '../services/userService';
import roleService from '../services/roleService';
import { handleServerErrors, getErrorMessage } from '../utils/validation';

const users = ref([]);
const roles = ref([]);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const showDeleteDialog = ref(false);
const modalMode = ref('create'); // 'create' or 'edit'
const currentUser = ref(null);

const formData = ref({
  name: '',
  email: '',
  password: ''
});

const errors = ref({
  name: '',
  email: '',
  password: ''
});

const validateForm = () => {
  let isValid = true;
  errors.value = { name: '', email: '', password: '' };

  if (!formData.value.name.trim()) {
    errors.value.name = 'Name is required';
    isValid = false;
  }

  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Invalid email format';
    isValid = false;
  }

  if (modalMode.value === 'create' && !formData.value.password) {
    errors.value.password = 'Password is required';
    isValid = false;
  }

  return isValid;
};

// Pagination and filtering
const currentPage = ref(1);
const searchQuery = ref('');
const sortField = ref('-id');

// Fetch users
const fetchUsers = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      sort: sortField.value
    };
    
    if (searchQuery.value) {
      params.name = searchQuery.value;
    }
    
    const response = await userService.getUsers(params);
    users.value = response.data || [];
  } catch (err) {
    error.value = 'Failed to load users';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const fetchRoles = async () => {
  try {
    const response = await roleService.getRoles();
    roles.value = response.data || [];
  } catch (err) {
    console.error('Failed to load roles', err);
  }
};

// Search handler with debounce
let searchTimeout;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchUsers();
  }, 300);
};

// Sort handler
const handleSort = (field) => {
  if (sortField.value === field) {
    sortField.value = `-${field}`;
  } else {
    sortField.value = field;
  }
  fetchUsers();
};

// Modal handlers
const openCreateModal = () => {
  modalMode.value = 'create';
  formData.value = { name: '', email: '', password: '', role_ids: [] };
  showModal.value = true;
};

const openEditModal = async (user) => {
  try {
    // Optional: Add a local loading state if needed
    const response = await userService.getUser(user.id);
    const fullUser = response.data;

    modalMode.value = 'edit';
    currentUser.value = fullUser;
    formData.value = {
      name: fullUser.name,
      email: fullUser.email,
      password: '', // Password is optional on update
      role_ids: fullUser.roles ? fullUser.roles.map(r => r.id) : []
    };
    showModal.value = true;
  } catch (err) {
    console.error('Failed to load user details', err);
    // Fallback to using the passed user object if fetch fails
    modalMode.value = 'edit';
    currentUser.value = user;
    formData.value = {
      name: user.name,
      email: user.email,
      password: '',
      role_ids: user.roles ? user.roles.map(r => r.id) : []
    };
    showModal.value = true;
  }
};

const closeModal = () => {
  showModal.value = false;
  currentUser.value = null;
  formData.value = { name: '', email: '', password: '', role_ids: [] };
  errors.value = { name: '', email: '', password: '' };
};

const openDeleteDialog = (user) => {
  currentUser.value = user;
  showDeleteDialog.value = true;
};

const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  currentUser.value = null;
};

// CRUD operations
const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const payload = { ...formData.value };
    
    // Remove password if empty on edit
    if (modalMode.value === 'edit' && !payload.password) {
      delete payload.password;
    }
    
    if (modalMode.value === 'create') {
      await userService.createUser(payload);
    } else {
      await userService.updateUser(currentUser.value.id, payload);
    }
    await fetchUsers();
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
    await userService.deleteUser(currentUser.value.id);
    await fetchUsers();
    closeDeleteDialog();
  } catch (err) {
    error.value = 'Failed to delete user';
    console.error(err);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

onMounted(() => {
  fetchUsers();
  fetchRoles();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">User Management</h2>
        <p class="text-slate-500 mt-1">Manage system users and their access</p>
      </div>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
      >
        + Create User
      </button>
    </div>

    <!-- Search and Filter Bar -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div class="flex gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search by name..."
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          v-model="sortField"
          @change="fetchUsers"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="-id">Newest First</option>
          <option value="id">Oldest First</option>
          <option value="name">Name (A-Z)</option>
          <option value="-name">Name (Z-A)</option>
        </select>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Roles
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-slate-600">#{{ user.id }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm mr-3">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <div class="text-sm font-semibold text-slate-800">{{ user.name }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-slate-600">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="role in (user.roles || []).slice(0, 2)"
                  :key="role.id"
                  class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                >
                  {{ role.name }}
                </span>
                <span
                  v-if="(user.roles || []).length > 2"
                  class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded"
                >
                  +{{ (user.roles || []).length - 2 }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                @click="openEditModal(user)"
                class="text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
              <button
                @click="openDeleteDialog(user)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-slate-500">
              No users found. Create your first user to get started.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-slate-200">
          <h3 class="text-lg font-bold text-slate-800">
            {{ modalMode === 'create' ? 'Create New User' : 'Edit User' }}
          </h3>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John Doe"
            />
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              v-model="formData.email"
              type="email"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="john@example.com"
            />
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Password {{ modalMode === 'edit' ? '(leave blank to keep current)' : '' }}
            </label>
            <input
              v-model="formData.password"
              type="password"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              :placeholder="modalMode === 'create' ? 'Enter password' : 'Leave blank to keep current'"
            />
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Roles</label>
            <div class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-slate-300 rounded-lg p-2">
              <label
                v-for="role in roles"
                :key="role.id"
                class="flex items-center space-x-2 p-1 hover:bg-slate-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="role.id"
                  v-model="formData.role_ids"
                  class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span class="text-sm text-slate-700">{{ role.name }}</span>
              </label>
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
          <h3 class="text-lg font-bold text-slate-800">Delete User</h3>
        </div>
        <div class="px-6 py-4">
          <p class="text-slate-600">
            Are you sure you want to delete <strong>{{ currentUser?.name }}</strong>? This action cannot be undone.
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
