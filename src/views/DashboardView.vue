<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const stats = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchDashboardData = async () => {
  try {
    const response = await api.get('/dashboard');
    stats.value = response.data.data;
  } catch (err) {
    error.value = 'Failed to load dashboard data';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center h-64">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>

  <div v-else-if="error" class="text-center py-10 text-red-600 bg-red-50 rounded-lg border border-red-100">
    {{ error }}
  </div>

  <div v-else class="space-y-8">
    <!-- Welcome Section -->
    <div>
      <h2 class="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
      <p class="text-slate-500 mt-1">Welcome back! Here's what's happening with your projects.</p>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">Total Projects</p>
            <p class="text-3xl font-bold text-slate-800 mt-2">{{ stats.statistics.total_projects }}</p>
          </div>
          <div class="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-500 font-medium flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            12%
          </span>
          <span class="text-slate-400 ml-2">vs last month</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">Total Tasks</p>
            <p class="text-3xl font-bold text-slate-800 mt-2">{{ stats.statistics.total_tasks }}</p>
          </div>
          <div class="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-500 font-medium flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            8%
          </span>
          <span class="text-slate-400 ml-2">vs last month</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">Total Users</p>
            <p class="text-3xl font-bold text-slate-800 mt-2">{{ stats.statistics.total_users }}</p>
          </div>
          <div class="p-3 rounded-xl bg-blue-50 text-blue-600">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-slate-400">Active users</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">Active Projects</p>
            <p class="text-3xl font-bold text-slate-800 mt-2">{{ stats.statistics.active_projects }}</p>
          </div>
          <div class="p-3 rounded-xl bg-amber-50 text-amber-600">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-slate-400">Currently in progress</span>
        </div>
      </div>
    </div>

    <!-- Recent Projects & Tasks -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Projects -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-lg font-bold text-slate-800">Recent Projects</h3>
          <router-link to="/projects" class="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</router-link>
        </div>
        <div class="divide-y divide-slate-100">
          <div v-for="project in stats.recent_projects" :key="project.id" class="px-6 py-4 hover:bg-slate-50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm mr-4">
                  {{ project.title.charAt(0) }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-800 truncate">{{ project.title }}</p>
                  <p class="text-xs text-slate-500">{{ project.client }}</p>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <span class="px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full"
                  :class="{
                    'bg-emerald-100 text-emerald-800': project.status === 'completed',
                    'bg-blue-100 text-blue-800': project.status === 'in_progress',
                    'bg-amber-100 text-amber-800': project.status === 'pending',
                    'bg-red-100 text-red-800': project.status === 'cancelled'
                  }">
                  {{ project.status.replace('_', ' ') }}
                </span>
                <div class="mt-2 w-24 bg-slate-200 rounded-full h-1.5">
                  <div class="bg-indigo-500 h-1.5 rounded-full" :style="{ width: project.completion_percentage + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="stats.recent_projects.length === 0" class="px-6 py-8 text-center text-slate-500">
            No recent projects found.
          </div>
        </div>
      </div>

      <!-- Recent Tasks -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-lg font-bold text-slate-800">Recent Tasks</h3>
          <router-link to="/tasks" class="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</router-link>
        </div>
        <div class="divide-y divide-slate-100">
          <div v-for="task in stats.recent_tasks" :key="task.id" class="px-6 py-4 hover:bg-slate-50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-start">
                 <div class="mt-1 mr-3">
                    <div class="w-2 h-2 rounded-full" :class="{
                      'bg-emerald-500': task.status === 'completed',
                      'bg-blue-500': task.status === 'in_progress',
                      'bg-amber-500': task.status === 'pending',
                      'bg-red-500': task.status === 'cancelled'
                    }"></div>
                 </div>
                 <div>
                    <p class="text-sm font-medium text-slate-800">{{ task.title }}</p>
                    <p class="text-xs text-slate-500 mt-0.5">Project: {{ task.project.title }}</p>
                 </div>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-xs text-slate-400">{{ new Date(task.deadline).toLocaleDateString() }}</span>
                <span v-if="task.is_overdue" class="text-xs text-red-600 font-bold mt-1 bg-red-50 px-2 py-0.5 rounded">Overdue</span>
              </div>
            </div>
          </div>
          <div v-if="stats.recent_tasks.length === 0" class="px-6 py-8 text-center text-slate-500">
            No recent tasks found.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
