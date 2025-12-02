<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const tasks = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchTasks = async () => {
  try {
    const response = await api.get('/tasks');
    tasks.value = response.data.data;
  } catch (err) {
    error.value = 'Failed to load tasks';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTasks();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Tasks</h2>
        <p class="text-slate-500 text-sm mt-1">Track and manage your team's tasks.</p>
      </div>
      <button class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 font-medium flex items-center justify-center">
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
            <tr v-for="task in tasks" :key="task.id" class="hover:bg-slate-50 transition-colors cursor-pointer group">
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
                <button class="text-slate-400 hover:text-indigo-600 transition-colors">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
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
  </div>
</template>
