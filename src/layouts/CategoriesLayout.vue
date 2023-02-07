<template>
  <q-layout
    view="hHh LpR lFf"
    :class="[categoriesPageStore.isAddingCategory && 'adding-category']">
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
        <CategoriesForm />
      </q-scroll-area>
    </q-drawer>
  </q-layout>
</template>

<script lang="ts">
export default {
  name: 'CategoriesLayout',
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

import useCategoriesPageStore from 'src/stores/pages/categoriesPage';

import LtHeader from 'components/general/header/LtHeader.vue';
import LtDrawerMenu from 'components/general/menu/LtDrawerMenu.vue';
import CategoriesForm from 'components/composable/categories/CategoriesForm.vue';

const categoriesPageStore = useCategoriesPageStore();

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

const drawerRight = computed(() => {
  const { addingCategory, editingCategory } = categoriesPageStore;

  return addingCategory || editingCategory;
});

function toggleLeftDrawer() {
  // leftDrawerOpen.value = !leftDrawerOpen.value;
  leftMiniDrawer.value = !leftMiniDrawer.value;
}

onMounted(() => {
  // const pageContainerRef = document.querySelector('.q-page-container');
  // pageContainerRef?.addEventListener('click', ():void => {
  //   console.log('click on page container');
  //   // close right drawer and clear store
  // });

  // const drawerLeftRef = document.querySelector('.q-drawer--left');
  // drawerLeftRef?.addEventListener('click', ():void => {
  //   console.log('click on drawer left');
  //   // close right drawer and clear store
  // });
});

</script>

<style lang="scss">
// $

.adding-category {
  .q-page,
  .left-drawer {
    filter: blur(5px);
    pointer-events: none;
  }
}
</style>
