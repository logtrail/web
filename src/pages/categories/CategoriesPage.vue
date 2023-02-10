<template>
  <q-page class="category-page full-height">
    <HeaderPage
      :categoryData="categoryData"
      :addCategory="addCategory" />

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
import Prism from 'prismjs';
import 'prismjs/themes/prism.min.css';
import 'prismjs/components/prism-javascript';

import {
  ref,
  nextTick,
  onMounted,
} from 'vue';

import { useQuasar } from 'quasar';
import { isEmpty } from 'lodash';

import { services } from 'src/services';

import NoData from './components/NoData.vue';
import HeaderPage from './components/Header.vue';
import SearchResult from "./components/SearchResult.vue";

// ------- //
// STATE'S //
// ------- //
const $q = useQuasar();
const categoryData = ref([]);

const openDrawerRight = ref<boolean>(false);
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
 * Add new category
 */
function addCategory() {
  // categoryPageStore.setAddingCategory(true);
}

/**
 * update category by id
 * @param categoryId: string - Category id
 */
function editCategory(categoryId: string): void {
  // const categoryDataToEdit = categoryPageStore.readCategory(categoryId);
  //
  // if (isEmpty(categoryDataToEdit)) return;
  //
  // const {
  //   _id,
  //   name,
  //   level,
  //   logTypeId,
  //   notifications,
  // } = categoryDataToEdit;
  //
  // categoryPageStore.newCategory = {
  //   _id,
  //   name,
  //   level,
  //   logTypeId,
  //   notifications,
  // };
  // categoryPageStore.setEditingCategory(true);
}

/**
 * Remove category by id
 * @param categoryId: string - Category id
 */
function removeCategory(categoryId: string): void {
  // const dialogProps = {
  //   title: 'Confirm',
  //   message: 'Would you like to delete this category?',
  //   cancel: true,
  //   persistent: true,
  // };
  //
  // $q.dialog(dialogProps)
  //   .onOk(async () => {
  //     await services.categories.deleteById(categoryId);
  //     await categoryPageStore.deleteCategory(categoryId);
  //   })
  //   .onCancel(() => {
  //     // nothing here
  //   });
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
