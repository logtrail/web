<template>
  <q-page class="category-page full-height">
    <div class="row full-width content-center items-center q-mb-xl">
      <p class="text-h3 col-shrink q-mr-md q-mb-none">Categories</p>
      <q-btn
        v-if="categoryPageStore.categoriesList.length"
        dense
        no-caps
        unelevated
        class="col-shrink btn-primary bg-primary text-secondary"
        icon="add"
        label="New category"
        padding="xs sm"
        @click="addCategory()" />
    </div>

    <div class="row full-width full-height">
      <template v-if="categoryPageStore.categoriesList.length">
        <q-table
          v-model:pagination="pagination"
          hide-pagination
          class="col-12"
          row-key="name"
          :columns="columns"
          :filter="filter"
          :rows="categoryPageStore.categoriesList">
          <template v-slot:top-right>
            <q-input
              v-model="filter"
              dense
              outlined
              debounce="300"
              placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div class="row justify-end">
                <q-btn
                  dense
                  round
                  unelevated
                  class="q-mr-xs"
                  color="blue"
                  @click="editCategory(props.row._id)">
                  <q-icon
                    name="edit"
                    color="white"
                    size="18px" />
                </q-btn>

                <q-btn
                  dense
                  round
                  unelevated
                  class="q-ml-xs"
                  color="red"
                  @click="removeCategory(props.row._id)">
                  <q-icon
                    name="delete_forever"
                    color="white"
                    size="18px" />
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>

        <div class="row justify-center q-mt-md full-width">
          <q-pagination
            v-model="pagination.page"
            color="secondary"
            size="md"
            :max="pagesNumber" />
        </div>
      </template>

      <template v-else>
        <div class="row col-12 justify-center items-center category-no-data">
          <div class="col-12 text-center">
            <img src="img/404.svg" width="250" height="250" alt="">
            <p class="q-mt-md">
              Wait! You don't have categories yet! Try to add new categories.
            </p>
            <q-btn
              dense
              no-caps
              unelevated
              class="col-shrink btn-primary bg-primary text-secondary text-weight-bold"
              icon="add"
              label="New category"
              padding="xs sm"
              @click="addCategory()" />
          </div>
        </div>
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
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { isEmpty } from 'lodash';

import useCategoriesPageStore from 'stores/pages/categoriesPage';

import ColumnTypes from './columns.type';

const $q = useQuasar();
const categoryPageStore = useCategoriesPageStore();

const columns: ColumnTypes[] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'level',
    align: 'left',
    label: 'Level',
    field: 'level',
  },
  {
    name: 'logType',
    align: 'left',
    label: 'LogType',
    field: 'logType',
  },
  {
    name: 'notifications',
    align: 'left',
    label: 'Notifications',
    field: 'notifications',
  },
  {
    name: 'actions',
    align: 'right',
    label: 'Actions',
    field: 'actions',
  },
];

const filter = ref('');

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  // rowsNumber: xx if getting data from a server
});

const pagesNumber = computed(() => {
  const { categoriesList = [] } = categoryPageStore;
  return Math.ceil(categoriesList.length / pagination.value.rowsPerPage);
});

function addCategory() {
  categoryPageStore.setAddingCategory(true);
}

function editCategory(categoryId: string): void {
  const categoryDataToEdit = categoryPageStore.readCategory(categoryId);

  if (isEmpty(categoryDataToEdit)) return;

  const {
    _id,
    name,
    level,
    logType,
    notifications,
  } = categoryDataToEdit;

  categoryPageStore.newCategory = {
    _id,
    name,
    level,
    logType,
    notifications,
  };
  categoryPageStore.setEditingCategory(true);
}

function removeCategory(categoryId: string): void {
  const dialogProps = {
    title: 'Confirm',
    message: 'Would you like to delete this category?',
    cancel: true,
    persistent: true,
  };

  $q.dialog(dialogProps)
    .onOk(async () => {
      await categoryPageStore.deleteCategory(categoryId);
    })
    .onCancel(() => {
      // nothing here
    });
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
