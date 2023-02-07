<template>
  <q-layout view="hHh Lpr lFf">
    <LtHeader @toggle-left-drawer="toggleLeftDrawer" />

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      class="bg-grey-2 q-pt-md"
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
  </q-layout>
</template>

<script lang="ts">
export default {
  name: 'MainLayout',
};
</script>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import LtHeader from 'components/general/header/LtHeader.vue';
import LtDrawerMenu from 'components/general/menu/LtDrawerMenu.vue';

const leftDrawerOpen = ref(true);
const leftMiniDrawer = ref(false);
const search = ref('');

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
    id: 'logtypes',
    icon: 'storage', // 'data_object',
    label: 'Search scheme',
    route: '/logtypes',
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

function toggleLeftDrawer() {
  // leftDrawerOpen.value = !leftDrawerOpen.value;
  leftMiniDrawer.value = !leftMiniDrawer.value;
}
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
</style>
