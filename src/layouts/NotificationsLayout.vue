<template>
  <q-layout
    view="hHh LpR lFf"
    :class="[notificationPageStore.isAddingNotification && 'adding-notification']">
    <LtHeader @toggle-left-drawer="toggleLeftDrawer" />

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      class="bg-grey-2 q-pt-md left-drawer"
      :mini="leftMiniDrawer"
      :width="250"
      @click="toggleLeftDrawer">
      <template v-slot:mini>
        <q-scroll-area class="fit mini-slot cursor-pointer">
          <div class="column items-start">
            <q-icon name="img:icons/favicon-32x32.png" class="mini-icon q-mb-md" />
            <q-icon
              v-for="{ icon, route } in menus"
              class="mini-icon"
              :class="[route === currentRoute && 'mini--active']"
              :key="`mini-${icon}`"
              :name="icon" />
          </div>
        </q-scroll-area>
      </template>

      <LtDrawerMenu
        :items="menus"
        @click.stop="() => ''" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-drawer
      v-model="drawerRight"
      overlay
      elevated
      class="bg-grey-2 q-pt-md right-drawer"
      side="right"
      :width="500">
      <q-scroll-area class="fit">
        <NotificationForm />
      </q-scroll-area>
    </q-drawer>
  </q-layout>
</template>

<script lang="ts">
export default {
  name: 'NotificationLayout',
};
</script>

<script setup lang="ts">
import {
  ref,
  computed,
  // defineAsyncComponent,
  onMounted,
} from 'vue';
import { useRoute } from 'vue-router';

import useNotificationPageStore from 'src/stores/pages/notificationsPage';

import LtHeader from 'components/general/header/LtHeader.vue';
import LtDrawerMenu from 'components/general/menu/LtDrawerMenu.vue';
import NotificationForm from 'components/composable/notifications/NotificationForm.vue';

const notificationPageStore = useNotificationPageStore();

const leftDrawerOpen = ref(true);
const leftMiniDrawer = ref(false);

const $route = useRoute();

const menus = [
  {
    id: 'logs',
    icon: 'view_day',
    label: 'Logs',
    route: '/',
  },
  {
    id: 'category',
    icon: 'tune',
    label: 'Categories',
    route: '/categories',
  },
  {
    id: 'searchScheme',
    icon: 'storage', // 'data_object',
    label: 'Search scheme',
    route: '/searchscheme',
  },
  {
    id: 'notifications',
    icon: 'notifications',
    label: 'Notifications',
    route: '/notifications',
  },
  {
    id: 'settings',
    icon: 'settings',
    label: 'Settings',
    route: '/settings',
  },
];

const currentRoute = computed(() => {
  const { fullPath = '' } = $route;
  return fullPath;
});

const drawerRight = computed(() => {
  const { addingNotification, editingNotification } = notificationPageStore;
  return addingNotification || editingNotification;
});

function toggleLeftDrawer() {
  // leftDrawerOpen.value = !leftDrawerOpen.value;
  leftMiniDrawer.value = !leftMiniDrawer.value;
}

onMounted(() => {
});

</script>

<style lang="scss">
// $

.q-item__section--avatar {
  min-width: 32px;
}

.q-router-link--active {
  background: $primary;
  color: $secondary!important;
  font-weight: 600;
}

.mini--active {
  color: $primary!important;
}

.mini-icon {
  font-size: 1.718em;
  padding: 2px 16px;

  & + & {
    margin-top: 18px;
  }
}

.adding-notification {
  .q-page,
  .left-drawer {
    filter: blur(5px);
    pointer-events: none;
  }
}
</style>
