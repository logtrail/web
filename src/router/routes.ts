import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/logs/LogsPage.vue') }],
  },
  {
    path: '/categories',
    component: () => import('layouts/CategoriesLayout.vue'),
    children: [{ path: '', component: () => import('pages/categories/CategoriesPage.vue') }],
  },
  {
    path: '/logtypes',
    component: () => import('layouts/LogTypesLayout.vue'),
    children: [{ path: '', component: () => import('pages/logtypes/LogTypesPage.vue') }],
  },
  {
    path: '/notifications',
    component: () => import('layouts/NotificationsLayout.vue'),
    children: [{ path: '', component: () => import('pages/notifications/NotificationsPage.vue') }],
  },
  {
    path: '/settings',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/settings/SettingsPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
