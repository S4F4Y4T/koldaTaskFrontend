<script setup>
import { ref, onMounted, computed } from 'vue';
import roleService from '../services/roleService';
import moduleService from '../services/moduleService';
import { handleServerErrors, getErrorMessage } from '../utils/validation';

const roles = ref([]);
const modules = ref([]);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const showDeleteDialog = ref(false);
const showPermissionModal = ref(false);
const modalMode = ref('create'); // 'create' or 'edit'
const currentRole = ref(null);
const selectedRoleForPermissions = ref(null);

const formData = ref({
  name: '',
  description: ''
});

const errors = ref({
  name: '',
  description: ''
});

const validateForm = () => {
  let isValid = true;
  errors.value = { name: '' };

  if (!formData.value.name.trim()) {
    errors.value.name = 'Role name is required';
    isValid = false;

  }

  if (!formData.value.description.trim()) {
    errors.value.description = 'Description is required';
    isValid = false;
  }

  return isValid;
};

const selectedPermissions = ref([]);

// Fetch roles and modules
const fetchRoles = async () => {
  try {
    loading.value = true;
    const response = await roleService.getRoles();
    roles.value = response.data || [];
  } catch (err) {
    error.value = 'Failed to load roles';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const fetchModules = async () => {
  try {
    const response = await moduleService.getModules();
    modules.value = response.data || [];
  } catch (err) {
    console.error('Failed to load modules:', err);
  }
};

// Modal handlers
const openCreateModal = () => {
  modalMode.value = 'create';
  formData.value = { name: '', description: '' };
  showModal.value = true;
};

const openEditModal = (role) => {
  modalMode.value = 'edit';
  currentRole.value = role;
  formData.value = {
    name: role.name,
    description: role.description || ''
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentRole.value = null;
  formData.value = { name: '', description: '' };
  errors.value = { name: '', description: '' };
};

const openDeleteDialog = (role) => {
  currentRole.value = role;
  showDeleteDialog.value = true;
};

const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  currentRole.value = null;
};

const openPermissionModal = async (role) => {
  try {
    loading.value = true;
    const response = await roleService.getRole(role.id);
    const fullRole = response.data;
    
    selectedRoleForPermissions.value = fullRole;
    // Pre-select existing permissions from the fresh data
    selectedPermissions.value = fullRole.permissions?.map(p => p.name) || [];
    showPermissionModal.value = true;
  } catch (err) {
    error.value = 'Failed to load role permissions';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const closePermissionModal = () => {
  showPermissionModal.value = false;
  selectedRoleForPermissions.value = null;
  selectedPermissions.value = [];
};

// CRUD operations
const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    if (modalMode.value === 'create') {
      await roleService.createRole(formData.value);
    } else {
      await roleService.updateRole(currentRole.value.id, formData.value);
    }
    await fetchRoles();
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
    await roleService.deleteRole(currentRole.value.id);
    await fetchRoles();
    closeDeleteDialog();
  } catch (err) {
    error.value = 'Failed to delete role';
    console.error(err);
  }
};

const handleAssignPermissions = async () => {
  try {
    await roleService.assignPermissions(
      selectedRoleForPermissions.value.id,
      selectedPermissions.value
    );
    await fetchRoles();
    closePermissionModal();
  } catch (err) {
    error.value = 'Failed to assign permissions';
    console.error(err);
  }
};

const togglePermission = (permissionName) => {
  const index = selectedPermissions.value.indexOf(permissionName);
  if (index > -1) {
    selectedPermissions.value.splice(index, 1);
  } else {
    selectedPermissions.value.push(permissionName);
  }
};

const isPermissionSelected = (permissionName) => {
  return selectedPermissions.value.includes(permissionName);
};

onMounted(() => {
  fetchRoles();
  fetchModules();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Roles & Permissions</h2>
        <p class="text-slate-500 mt-1">Manage user roles and their permissions</p>
      </div>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
      >
        + Create Role
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Roles Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Role Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Description
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Permissions
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr v-for="role in roles" :key="role.id" class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-semibold text-slate-800">{{ role.name }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-slate-600">{{ role.description || 'No description' }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="permission in (role.permissions || []).slice(0, 3)"
                  :key="permission.id"
                  class="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded"
                >
                  {{ permission.label }}
                </span>
                <span
                  v-if="(role.permissions || []).length > 3"
                  class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded"
                >
                  +{{ (role.permissions || []).length - 3 }} more
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                @click="openPermissionModal(role)"
                class="text-indigo-600 hover:text-indigo-900"
              >
                Permissions
              </button>
              <button
                @click="openEditModal(role)"
                class="text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
              <button
                @click="openDeleteDialog(role)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="roles.length === 0">
            <td colspan="4" class="px-6 py-8 text-center text-slate-500">
              No roles found. Create your first role to get started.
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
            {{ modalMode === 'create' ? 'Create New Role' : 'Edit Role' }}
          </h3>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Role Name</label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Editor"
            />
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Role Description"
            ></textarea>
            <p v-if="errors.description" class="text-red-500 text-xs mt-1">{{ errors.description }}</p>
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
          <h3 class="text-lg font-bold text-slate-800">Delete Role</h3>
        </div>
        <div class="px-6 py-4">
          <p class="text-slate-600">
            Are you sure you want to delete the role <strong>{{ currentRole?.name }}</strong>? This action cannot be undone.
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

    <!-- Permission Assignment Modal -->
    <div v-if="showPermissionModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-slate-200">
          <h3 class="text-lg font-bold text-slate-800">
            Assign Permissions to {{ selectedRoleForPermissions?.name }}
          </h3>
        </div>
        <div class="px-6 py-4 overflow-y-auto flex-1">
          <div v-for="module in modules" :key="module.id" class="mb-6">
            <h4 class="text-sm font-bold text-slate-700 mb-3 flex items-center">
              <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              {{ module.name }}
            </h4>
            <div class="grid grid-cols-2 gap-2 ml-4">
              <label
                v-for="permission in module.permissions"
                :key="permission.id"
                class="flex items-center space-x-2 p-2 rounded hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :checked="isPermissionSelected(permission.name)"
                  @change="togglePermission(permission.name)"
                  class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span class="text-sm text-slate-700">{{ permission.label }}</span>
              </label>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            @click="closePermissionModal"
            class="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleAssignPermissions"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
