import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
            meta: { guest: true }
        },
        {
            path: '/',
            component: () => import('../layouts/MainLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('../views/DashboardView.vue')
                },
                {
                    path: 'projects',
                    name: 'projects',
                    component: () => import('../views/ProjectListView.vue')
                },
                {
                    path: 'tasks',
                    name: 'tasks',
                    component: () => import('../views/TaskListView.vue')
                }
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'login' });
    } else if (to.meta.guest && isAuthenticated) {
        next({ name: 'dashboard' });
    } else {
        next();
    }
});

export default router;
