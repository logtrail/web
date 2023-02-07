<template>
  <q-page class="logType-page full-height">
    <div class="row full-width content-center items-center q-mb-xl">
      <p class="text-h3 col-shrink q-mr-md q-mb-none">Search scheme</p>
      <q-btn
        v-if="searchSchemePageStore.logTypesList.length"
        dense
        no-caps
        unelevated
        class="col-shrink btn-primary bg-primary text-white"
        icon="add"
        label="New Search Scheme"
        padding="xs sm"
        @click="addLogType()" />
    </div>

    <div class="row full-width full-height">
      <template v-if="searchSchemePageStore.logTypesList.length">
        <q-table
          v-model:pagination="pagination"
          hide-pagination
          class="col-12"
          row-key="_id"
          :columns="COLUMNS"
          :rows="searchSchemePageStore.logTypesList">

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
                    @click.stop="editSearchSchemeById(props.row._id)">
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
                    @click.stop="removeSearchSchemeById(props.row._id)">
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
        </q-table>

        <div class="row justify-center q-mt-md full-width">
          <q-pagination
            v-model="pagination.page"
            color="secondary"
            size="md"
            :max="pagination.total" />
        </div>
      </template>

      <template v-else>
        <div class="row col-12 justify-center items-center logType-no-data">
          <div class="col-12 text-center">
            <img src="img/empty-logType.svg" width="250" height="250" alt="">
            <p class="q-mt-md text-weight-bold">
              Wait! You don't have search secheme yet! Try to add new search scheme.
            </p>
            <q-btn
              dense
              no-caps
              unelevated
              class="col-shrink btn-primary bg-primary text-weight-bold text-white"
              icon="add"
              label="New search scheme"
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

import { services } from 'src/services';

import useLogTypesPageStore from 'stores/pages/logTypesPage';
import { COLUMNS } from './contants';

const $q = useQuasar();
const searchSchemePageStore = useLogTypesPageStore();

const pagination = ref({
  page: 1,
  perPage: 5,
  total: 1,
});

watch(searchSchemePageStore.logTypesList, async () => {
  await nextTick();
  Prism.highlightAll();
});

onMounted(async () => {
  const {
    items: searchSchemeList,
    pagination: paginationIfo,
  } = await services.searchSchemas.find(pagination.value);

  pagination.value.total = paginationIfo.total;
  searchSchemePageStore.setSearchScheme(searchSchemeList);

  Prism.highlightAll();
});

function addLogType() {
  searchSchemePageStore.setAddingLogType(true);
}

/**
 * Edit search scheme by id
 * @param searchSchemeId: string - Scheme id
 */
function editSearchSchemeById(searchSchemeId: string): void {
  const logTypeDataToEdit = searchSchemePageStore.readLogType(searchSchemeId);

  if (isEmpty(logTypeDataToEdit)) return;

  const {
    _id,
    name,
    fields,
  } = logTypeDataToEdit;

  searchSchemePageStore.newLogType = {
    name,
    fields,
    _id,
  };

  searchSchemePageStore.setEditingLogType(true);
}

/**
 * Remove search scheme byu id
 * @param searchSchemeId: string - Search scheme
 */
function removeSearchSchemeById(searchSchemeId: string): void {
  const dialogProps = {
    title: 'Confirm',
    message: 'Would you like to delete this search scheme?',
    cancel: true,
    persistent: true,
  };

  $q.dialog(dialogProps)
    .onOk(async () => {
      await services.searchSchemas.deleteById(searchSchemeId);
      await searchSchemePageStore.deleteLogType(searchSchemeId);
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
