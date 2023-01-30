<template>
  <q-page class="logType-page full-height">
    <div class="row full-width content-center items-center q-mb-xl">
      <p class="text-h3 col-shrink q-mr-md q-mb-none">LogTypes</p>
      <q-btn
        v-if="logTypePageStore.logTypesList.length"
        dense
        no-caps
        unelevated
        class="col-shrink btn-primary bg-primary text-secondary"
        icon="add"
        label="New LogType"
        padding="xs sm"
        @click="addLogType()" />
    </div>

    <div class="row full-width full-height">
      <template v-if="logTypePageStore.logTypesList.length">
        <q-table
          v-model:pagination="pagination"
          hide-pagination
          class="col-12"
          row-key="name"
          :columns="columns"
          :filter="filter"
          :rows="logTypePageStore.logTypesList">
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
                  @click="editLogType(props.row._id)">
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
                  @click="removeLogType(props.row._id)">
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
        <div class="row col-12 justify-center items-center logType-no-data">
          <div class="col-12 text-center">
            <img src="img/empty-logType.svg" width="250" height="250" alt="">
            <p class="q-mt-md">
              Wait! You don't have logTypes yet! Try to add new logType.
            </p>
            <q-btn
              dense
              no-caps
              unelevated
              class="col-shrink btn-primary bg-primary text-secondary text-weight-bold"
              icon="add"
              label="New logType"
              padding="xs sm"
              @click="addLogType()" />
          </div>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script lang="ts">
export default {
  name: 'LogTypesPage',
};
</script>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { isEmpty } from 'lodash';

import useLogTypesPageStore from 'stores/pages/logTypesPage';

import ColumnTypes from './columns.type';

const $q = useQuasar();
const logTypePageStore = useLogTypesPageStore();

const columns: ColumnTypes[] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
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
  const { logTypesList = [] } = logTypePageStore;
  return Math.ceil(logTypesList.length / pagination.value.rowsPerPage);
});

function addLogType() {
  logTypePageStore.setAddingLogType(true);
}

function editLogType(logTypeId: string): void {
  const logTypeDataToEdit = logTypePageStore.readLogType(logTypeId);

  if (isEmpty(logTypeDataToEdit)) return;

  const {
    _id,
  } = logTypeDataToEdit;

  logTypePageStore.newLogType = {
    _id,
  };

  logTypePageStore.setEditingLogType(true);
}

function removeLogType(logTypeId: string): void {
  const dialogProps = {
    title: 'Confirm',
    message: 'Would you like to delete this logType?',
    cancel: true,
    persistent: true,
  };

  $q.dialog(dialogProps)
    .onOk(async () => {
      await logTypePageStore.deleteLogType(logTypeId);
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

.logType-card-content {
  padding: 8px;
  border: 1px solid rgba($secondary, .3);
  border-radius: 4px;
}

.q-table__card {
  box-shadow: none;
  border: 1px solid rgba($secondary, .3);
}

.logType-no-data {
  height: calc(100vh - #{$used-area})!important;
}
</style>
