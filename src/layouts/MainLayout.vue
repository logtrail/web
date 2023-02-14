<template>
  <q-layout view="hHh Lpr fFf">
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
              v-for="{ icon, route, class: iconClass } in menus"
              class="mini-icon"
              :class="[route === currentRoute && 'mini--active', iconClass]"
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

    <q-footer class="bg-white q-px-md text-dark" bordered>
      <q-toolbar>
        <q-toolbar-title class="items-center row">
          <span class="q-pr-sm">Logtrail</span>
          <q-badge :label="`v ${currentVersion}`" />
        </q-toolbar-title>

        <div class="footer-menu">
          <a
            class="row items-center"
            href="https://github.com/logtrail/web"
            target="_blank">
            <q-icon
              class="q-pr-xs"
              name="mdi-github"
              size="18px" />
            <span>GitHub</span>
            <q-icon
              class="q-pl-xs"
              name="open_in_new" />
          </a>
        </div>

        Made with <span class="text-red q-px-sm">&#10084;</span> by LogTrail Team
      </q-toolbar>
    </q-footer>
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

import { version as currentVersion } from 'app/package.json';

import LtHeader from 'components/general/header/LtHeader.vue';
import LtDrawerMenu from 'components/general/menu/LtDrawerMenu.vue';

const leftDrawerOpen = ref(true);
const leftMiniDrawer = ref(false);

const $route = useRoute();

const menus = [
  {
    id: 'logs',
    icon: 'view_day',
    label: 'Logs',
    route: '/',
    class: '',
  },
  {
    id: 'category',
    icon: 'push_pin',
    label: 'Categories',
    route: '/categories',
    class: 'rotate-45',
  },
  {
    id: 'searchScheme',
    icon: 'storage', // 'data_object',
    label: 'Search scheme',
    route: '/searchscheme',
    class: '',
  },
  {
    id: 'notifications',
    icon: 'notifications',
    label: 'Notifications',
    route: '/notifications',
    class: '',
  },
  {
    id: 'settings',
    icon: 'settings',
    label: 'Settings',
    route: '/settings',
    class: '',
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

.footer-menu {
  margin: 0 32px 0 0;

  a {
    color: $primary;
    font-weight: 500;
    text-decoration: none;
  }
}
</style>
