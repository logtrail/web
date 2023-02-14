<template>
  <q-page class="search-scheme-page full-height">
    <!-- MENU TO ADD / EDIT FORM -->
    <Drawer
      v-model:formData="formData"
      v-model:openDrawer="openDrawer"
      :drawerMode="drawerMode"
      :saveFormData="saveFormData" />

    <!-- HEADER PAGE -->
    <HeaderPage
      :addSearchScheme="addSearchScheme"
      :searchSchemesData="searchSchemesData" />

    <div class="row full-width full-height">
      <!-- SEARCH RESULT -->
      <template v-if="searchSchemesData.length">
        <SearchResult
          :pagination="pagination"
          :switchPage="switchPage"
          :editSearchScheme="editSearchScheme"
          :removeSearchScheme="removeSearchScheme"
          :searchSchemesData="searchSchemesData" />
      </template>

      <template v-else-if="loadingSchemesData">
        <LoadCard />
      </template>

      <!-- NO DATA -->
      <template v-else>
        <NoData :addSearchScheme="addSearchScheme" />
      </template>
    </div>
  </q-page>
</template>

<script lang="ts">
export default {
  name: 'SearchSchemePage',
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
  reactive,
  toRaw,
  nextTick,
  onMounted,
} from 'vue';

import { useQuasar } from 'quasar';
import { services } from 'src/services';

import LoadCard from 'components/general/card/loadCard/LoadCard.vue';
import NoData from './components/NoData.vue';
import HeaderPage from './components/Header.vue';
import SearchResult from './components/SearchResult.vue';
import Drawer from './components/Drawer.vue';

import { SearchSchemeData } from './interfaces';
import { DEFAULT_STATE } from './constants';

// ------- //
// STATE'S //
// ------- //
const $q = useQuasar();

const searchSchemesData = ref<SearchSchemeData[]>([]);
const formData = reactive({ ...DEFAULT_STATE });
const drawerMode = ref<string>('add');
const openDrawer = ref<boolean>(false);
const pagination = ref({
  page: 1,
  perPage: 10,
  total: 1,
});
const loadingSchemesData = ref<boolean>(false);

onMounted(async () => {
  await getSearchSchemes();
});

/**
 * Switch pagination
 * @param page
 */
async function switchPage(page: number) {
  pagination.value.page = page;
  await getSearchSchemes();
}

/**
 * Get searchSchemes
 * @param currentPage: number - Current page
 */
async function getSearchSchemes() {
  loadingSchemesData.value = true;
  const {
    items: searchSchemes,
    pagination: paginationIfo,
  } = await services.searchSchemas.find(pagination.value);

  searchSchemesData.value = searchSchemes;
  pagination.value.total = paginationIfo.total;

  await nextTick();
  Prism.highlightAll();
  loadingSchemesData.value = false;
}

/**
 * Click to save form data
 */
async function saveFormData() {
  if (drawerMode.value === 'add') {
    const searchScheme = await services.searchSchemas.create(toRaw(formData));
    searchSchemesData.value.push(searchScheme);
  } else {
    const { _id: searchSchemeId } = formData;
    const searchScheme = await services.searchSchemas.updateById(searchSchemeId, toRaw(formData));
    const searchSchemeIndex = getIndexById(searchSchemeId);
    searchSchemesData.value[searchSchemeIndex] = searchScheme;
  }

  // Clean form
  Object.assign(formData, DEFAULT_STATE);
  openDrawer.value = false;

  await nextTick();
  Prism.highlightAll();
}

/**
 * update searchScheme by id
 */
function addSearchScheme(): void {
  drawerMode.value = 'add';
  openDrawer.value = true;
}

/**
 * update searchScheme by id
 * @param searchSchemeId: string - SearchScheme id
 */
function editSearchScheme(searchSchemeId: string): void {
  const searchScheme = getSearchSchemeById(searchSchemeId);

  Object.assign(formData, searchScheme);
  drawerMode.value = 'edit';
  openDrawer.value = true;
}

/**
 * Remove searchScheme by id
 * @param searchSchemeId: string - SearchScheme id
 */
function removeSearchScheme(searchSchemeId: string): void {
  const dialogProps = {
    title: 'Confirm',
    message: 'Would you like to delete this search scheme?',
    cancel: true,
    persistent: true,
  };

  $q.dialog(dialogProps)
    .onOk(async () => {
      await services.searchSchemas.deleteById(searchSchemeId);
      const searchSchemeIndex = getIndexById(searchSchemeId);
      searchSchemesData.value.splice(searchSchemeIndex, 1);
    })
    .onCancel(() => {
      // nothing here
    });
}

/**
 * Get searchScheme by id
 * @param searchSchemeId: string - SearchScheme id
 */
function getSearchSchemeById(searchSchemeId: string) {
  return searchSchemesData
    .value
    .find((item: any) => item._id === searchSchemeId);
}

/**
 * Get searchScheme by id
 * @param searchSchemeId: string - SearchScheme id
 */
function getIndexById(searchSchemeId: string) {
  return searchSchemesData
    .value
    .findIndex((item: any) => item._id === searchSchemeId);
}
</script>

<style lang="scss">
$header-height: 50px;
$padding-y: 32px;
$title-height: 50px + 48px; // 48px margin bottom

$used-area: $header-height + $padding-y + ($title-height * 2);

.search-scheme-card-content {
  padding: 8px;
  border: 1px solid rgba($secondary, .3);
  border-radius: 4px;
}

.q-table__card {
  box-shadow: none;
  border: 1px solid rgba($secondary, .3);
}

.searchScheme-no-data {
  height: calc(100vh - #{$used-area})!important;
}
</style>
