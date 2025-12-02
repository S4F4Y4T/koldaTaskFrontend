<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('test@example.com');
const password = ref('password');
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  const success = await authStore.login({
    email: email.value,
    password: password.value
  });

  if (success) {
    router.push({ name: 'dashboard' });
  } else {
    error.value = authStore.error;
  }
};
</script>

<template>
  <div class="min-h-screen flex bg-white">
    <!-- Left Side - Form -->
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2 xl:w-5/12 z-10 relative">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-200">
            <span class="font-bold text-white text-2xl">K</span>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h2>
          <p class="mt-2 text-sm text-slate-600">
            Please sign in to your account to continue.
          </p>
        </div>

        <div class="mt-8">
          <div class="mt-6">
            <form action="#" method="POST" class="space-y-6" @submit.prevent="handleLogin">
              <div>
                <label for="email" class="block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <div class="mt-1">
                  <input id="email" name="email" type="email" autocomplete="email" required v-model="email"
                    class="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    placeholder="Enter your email">
                </div>
              </div>

              <div class="space-y-1">
                <label for="password" class="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div class="mt-1">
                  <input id="password" name="password" type="password" autocomplete="current-password" required v-model="password"
                    class="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    placeholder="Enter your password">
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded">
                  <label for="remember-me" class="ml-2 block text-sm text-slate-900">
                    Remember me
                  </label>
                </div>

                <div class="text-sm">
                  <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div v-if="error" class="rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">
                      {{ error }}
                    </h3>
                  </div>
                </div>
              </div>

              <div>
                <button type="submit" :disabled="authStore.loading"
                  class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 transform hover:-translate-y-0.5">
                  {{ authStore.loading ? 'Signing in...' : 'Sign in' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Image -->
    <div class="hidden lg:block relative w-0 flex-1 bg-slate-900">
      <div class="absolute inset-0 h-full w-full object-cover overflow-hidden">
         <!-- Abstract Background Pattern -->
         <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 opacity-90"></div>
         <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center mix-blend-overlay"></div>
         
         <div class="absolute inset-0 flex flex-col justify-center items-center text-white p-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Manage Projects with Ease</h1>
            <p class="text-lg text-indigo-100 max-w-lg">Streamline your workflow, track progress, and collaborate with your team in one centralized platform.</p>
         </div>
      </div>
    </div>
  </div>
</template>
