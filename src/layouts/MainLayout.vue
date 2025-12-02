<script setup>
import { ref, computed } from 'vue';
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const isSidebarOpen = ref(true); // Default open on desktop

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'login' });
};

const pageTitle = computed(() => {
  return route.name ? route.name.charAt(0).toUpperCase() + route.name.slice(1) : '';
});

const navigation = [
  { name: 'Dashboard', to: 'dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { name: 'Projects', to: 'projects', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' }, // Replaced with Home icon temporarily or find better project icon path
  { name: 'Tasks', to: 'tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
];
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex font-sans">
    <!-- Sidebar -->
    <aside 
      class="bg-slate-900 text-white transition-all duration-300 ease-in-out fixed inset-y-0 left-0 z-30 md:relative flex flex-col shadow-xl"
      :class="isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:w-20 md:translate-x-0'"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-slate-800">
        <div class="flex items-center space-x-2" :class="{ 'px-4': !isSidebarOpen }">
          <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="font-bold text-white text-lg">K</span>
          </div>
          <span v-if="isSidebarOpen" class="text-xl font-bold tracking-wide">KoldaTask</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        <RouterLink 
          v-for="item in navigation" 
          :key="item.name"
          :to="{ name: item.to }" 
          class="flex items-center px-3 py-3 rounded-lg transition-colors duration-200 group"
          :class="[
            route.name === item.to 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <svg class="w-6 h-6 flex-shrink-0 transition-colors duration-200" :class="route.name === item.to ? 'text-white' : 'text-slate-500 group-hover:text-white'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
          </svg>
          <span v-if="isSidebarOpen" class="ml-3 font-medium">{{ item.name }}</span>
          
          <!-- Tooltip for collapsed state -->
          <div v-if="!isSidebarOpen" class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
            {{ item.name }}
          </div>
        </RouterLink>
      </nav>

      <!-- User Profile (Bottom) -->
      <div class="p-4 border-t border-slate-800">
        <div class="flex items-center" :class="{ 'justify-center': !isSidebarOpen }">
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 cursor-pointer shadow-lg">
            {{ authStore.currentUser?.name?.charAt(0) || 'U' }}
          </div>
          <div v-if="isSidebarOpen" class="ml-3 overflow-hidden">
            <p class="text-sm font-medium text-white truncate">{{ authStore.currentUser?.name }}</p>
            <p class="text-xs text-slate-400 truncate">{{ authStore.currentUser?.email }}</p>
          </div>
          <button v-if="isSidebarOpen" @click="handleLogout" class="ml-auto text-slate-400 hover:text-red-400 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
      <!-- Header -->
      <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 h-16 flex items-center justify-between px-6 shadow-sm">
        <div class="flex items-center">
          <button @click="isSidebarOpen = !isSidebarOpen" class="text-slate-500 hover:text-indigo-600 focus:outline-none transition-colors mr-4">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          <h1 class="text-xl font-bold text-slate-800">{{ pageTitle }}</h1>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Notifications (Mock) -->
          <button class="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto p-6 scroll-smooth">
        <div class="max-w-7xl mx-auto">
          <RouterView v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </RouterView>
        </div>
      </main>
    </div>
    
    <!-- Mobile Overlay -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm transition-opacity"></div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
