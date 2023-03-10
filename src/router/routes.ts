import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/logs/LogsPage.vue') }],
  },
  {
    path: '/log-details/:logId',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/logDetails/LogDetails.vue') }],
  },
  {
    path: '/categories',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/categories/CategoriesPage.vue') }],
  },
  {
    path: '/searchscheme',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/searchScheme/SearchSchemePage.vue') }],
  },
  {
    path: '/notifications',
    component: () => import('layouts/MainLayout.vue'),
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
    component: () => import('pages/ErrorNotFound/ErrorNotFound.vue'),
  },
];

export default routes;
