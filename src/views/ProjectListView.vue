<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const projects = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchProjects = async () => {
  try {
    const response = await api.get('/projects');
    projects.value = response.data.data;
  } catch (err) {
    error.value = 'Failed to load projects';
    console.error(err);
  } finally {
    loading.value = false;
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
      <button class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 font-medium flex items-center justify-center">
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
      <div v-for="project in projects" :key="project.id" class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-200 group cursor-pointer">
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-200">
            {{ project.title.charAt(0) }}
          </div>
          <span class="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full capitalize"
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
            <span class="font-medium text-slate-700">65%</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div class="bg-indigo-500 h-2 rounded-full" style="width: 65%"></div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
          <div class="flex -space-x-2">
            <!-- Mock Avatars -->
            <div class="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
            <div class="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
            <div class="w-8 h-8 rounded-full border-2 border-white bg-slate-400 flex items-center justify-center text-xs text-white font-medium">+2</div>
          </div>
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
          <button class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            New Project
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
