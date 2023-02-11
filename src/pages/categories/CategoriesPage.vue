<template>
  <q-page class="category-page full-height">
    <!-- MENU TO ADD / EDIT FORM -->
    <Drawer
      v-model:formData="formData"
      v-model:openDrawer="openDrawer"
      :drawerMode="drawerMode"
      :saveFormData="saveFormData" />

    <!-- HEADER PAGE -->
    <HeaderPage
      :addCategory="addCategory"
      :categoryData="categoryData"  />

    <div class="row full-width full-height">
      <!-- SEARCH RESULT -->
      <SearchResult
        v-if="categoryData.length"
        :pagination="pagination"
        :switchPage="switchPage"
        :editCategory="editCategory"
        :removeCategory="removeCategory"
        :categoryData="categoryData" />

      <!-- NO DATA -->
      <template v-else>
        <NoData
          :addCategory="addCategory" />
      </template>
    </div>
  </q-page>
</template>

<script lang="ts">
export default {
  name: 'CategoriesPage',
};
</script>

<script setup lang="ts">
/**
 * Impor LIBS / Components / Contants / etc..
 */
import Prism from 'prismjs';
import 'prismjs/themes/prism.min.css';
import 'prismjs/components/prism-javascript';

import {
  ref,
  nextTick,
  onMounted,
  reactive,
  toRaw,
} from 'vue';

import { useQuasar } from 'quasar';

import { services } from 'src/services';

import NoData from './components/NoData.vue';
import HeaderPage from './components/Header.vue';
import SearchResult from './components/SearchResult.vue';
import Drawer from './components/Drawer.vue';

import { DEFAULT_STATE } from './constants';

// ------- //
// STATE'S //
// ------- //
const $q = useQuasar();

const categoryData = ref<any>([]);
const formData = reactive({ ...DEFAULT_STATE });
const drawerMode = ref<string>('add');
const openDrawer = ref<boolean>(false);
const pagination = ref({
  page: 1,
  perPage: 10,
  total: 1,
});

onMounted(async () => {
  await getCategories();
});

/**
 * Switch pagination
 * @param page
 */
async function switchPage(page: number) {
  pagination.value.page = page;
  await getCategories();
}

/**
 * Get categories
 * @param currentPage: number - Current page
 */
async function getCategories() {
  const {
    items: categories,
    pagination: paginationIfo,
  } = await services.categories.find(pagination.value);

  categoryData.value = categories;
  pagination.value.total = paginationIfo.total;

  await nextTick();
  Prism.highlightAll();
}

/**
 * Click to save form data
 */
async function saveFormData() {
  if (drawerMode.value === 'add') {
    const category = await services.categories.create(toRaw(formData));
    categoryData.value.push(category);
  } else {
    const { _id: categoryId } = formData;
    const category = await services.categories.updateById(categoryId, toRaw(formData));
    const categoryIndex = getIndexById(categoryId);
    categoryData.value[categoryIndex] = category;
  }

  // Clean form
  Object.assign(formData, DEFAULT_STATE);
  openDrawer.value = false;

  // Update highligh
  await nextTick();
  Prism.highlightAll();
}

/**
 * update category by id
 * @param categoryId: string - Category id
 */
function addCategory(): void {
  drawerMode.value = 'add';
  openDrawer.value = true;
}

/**
 * update category by id
 * @param categoryId: string - Category id
 */
function editCategory(categoryId: string): void {
  const category = getCategoryById(categoryId);

  Object.assign(formData, category);
  drawerMode.value = 'edit';
  openDrawer.value = true;
}

/**
 * Remove category by id
 * @param categoryId: string - Category id
 */
function removeCategory(categoryId: string): void {
  const dialogProps = {
    title: 'Confirm',
    message: 'Would you like to delete this category?',
    cancel: true,
    persistent: true,
  };

  $q.dialog(dialogProps)
    .onOk(async () => {
      await services.categories.deleteById(categoryId);
      const categoryIndex = getIndexById(categoryId);
      categoryData.value.splice(categoryIndex, 1);
    })
    .onCancel(() => {
      // nothing here
    });
}

/**
 * Get category by id
 * @param categoryId: string - Category id
 */
function getCategoryById(categoryId: string) {
  return categoryData
    .value
    .find((item: any) => item._id === categoryId);
}

/**
 * Get category by id
 * @param categoryId: string - Category id
 */
function getIndexById(categoryId: string) {
  return categoryData
    .value
    .findIndex((item: any) => item._id === categoryId);
}
</script>

<style lang="scss">
$header-height: 50px;
$padding-y: 32px;
$title-height: 50px + 48px; // 48px margin bottom

$used-area: $header-height + $padding-y + ($title-height * 2);

.category-card-content {
  padding: 8px;
  border: 1px solid rgba($secondary, .3);
  border-radius: 4px;
}

.q-table__card {
  box-shadow: none;
  border: 1px solid rgba($secondary, .3);
}

.category-no-data {
  height: calc(100vh - #{$used-area})!important;
}
</style>
