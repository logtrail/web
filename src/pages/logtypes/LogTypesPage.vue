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
          row-key="_id"
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

          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width />
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr
              :key="props.row._id"
              :props="props">
              <q-td auto-width>
                <q-btn
                  dense
                  round
                  unelevated
                  color="info"
                  size="sm"
                  :icon="props.expand ? 'remove' : 'add'"
                  @click.stop="props.expand = !props.expand" />
              </q-td>
              <q-td
                v-for="col in props.cols"
                class="cursor-pointer"
                :key="col.name"
                :props="props"
                @click.stop="props.expand = !props.expand">
                <span v-if="col.name === 'name'">{{ col.value }}</span>
                <span v-if="col.name === 'fields'">{{ col.value }}</span>
                <span v-if="col.name === 'created'">
                  {{ formatDate(col.value, 'YYYY/MM/DD HH:mm:ss') }}
                </span>
                <div
                  v-if="col.name === 'actions'"
                  class="row justify-end">
                  <q-btn
                    dense
                    round
                    unelevated
                    class="q-mr-xs"
                    color="blue"
                    @click.stop="editLogType(props.row._id)">
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
                    color="red-5"
                    @click.stop="removeLogType(props.row._id)">
                    <q-icon
                      name="delete"
                      color="white"
                      size="18px" />
                  </q-btn>
                </div>
              </q-td>
            </q-tr>

            <q-tr
              :key="props.row._id"
              v-show="props.expand"
              :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <p class="text-h6">LogType</p>
                  <pre class="language-javascript"><code>{{ props.row.fields }}</code></pre>
                </div>
              </q-td>
            </q-tr>
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
                  color="red-5"
                  @click="removeLogType(props.row._id)">
                  <q-icon
                    name="delete"
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
            <p class="q-mt-md text-weight-bold">
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
import Prism from 'prismjs';
import 'prismjs/themes/prism.min.css';
import 'prismjs/components/prism-javascript';

import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
} from 'vue';
import { useQuasar } from 'quasar';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';

import useLogTypesPageStore from 'stores/pages/logTypesPage';

import ColumnTypes from './columns.type';

const $q = useQuasar();
const logTypePageStore = useLogTypesPageStore();

const columns: ColumnTypes[] = [
  {
    name: 'name',
    label: 'LogType',
    field: 'name',
    align: 'left',
  },
  {
    name: 'fields',
    label: 'Fields',
    field: 'fields',
    align: 'left',
    format: (val) => `${val.length} field${val.length > 1 ? 's' : ''}`,
  },
  {
    name: 'created',
    align: 'left',
    label: 'Created At',
    field: 'created',
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

watch(logTypePageStore.logTypesList, async () => {
  await nextTick();
  Prism.highlightAll();
});

onMounted(() => {
  Prism.highlightAll();
});

function addLogType() {
  logTypePageStore.setAddingLogType(true);
}

function editLogType(logTypeId: string): void {
  const logTypeDataToEdit = logTypePageStore.readLogType(logTypeId);

  if (isEmpty(logTypeDataToEdit)) return;

  const {
    _id,
    name,
    fields,
  } = logTypeDataToEdit;

  logTypePageStore.newLogType = {
    name,
    fields,
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

/**
 * Format date
 * @param date: Date - Date to format
 * @param format: string - Format type
 */
function formatDate(date: Date, format: string) {
  return dayjs(date).format(format);
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
