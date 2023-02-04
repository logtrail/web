<template>
  <q-page class="logs-page full-height">
    <div class="row full-width content-center items-center q-mb-xl">
      <p class="text-h3 col-grow q-mr-md q-mb-none">Logs</p>
    </div>

    <div class="row q-pb-sm full-width q-gutter-sm">
      <q-input label="Start Date" filled v-model="startDate">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="startDate" mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="startDate" mask="YYYY-MM-DD HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input label="End Date" filled v-model="endDate">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="endDate" mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="endDate" mask="YYYY-MM-DD HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-select
        v-model="levels"
        outlined
        multiple
        label="Levels"
        class="col-2"
        :options="LEVEL_OPTIONS"/>

      <q-select
        v-model="categories"
        class="col"
        filled
        multiple
        :options="categoriesOptions"
        :loading="searchMoreCategories"
        @virtual-scroll="getCategories" />
    </div>
    <div class="row">
      <q-btn
        color="green"
        label="Buscar"
        @click.stop="getLogs"/>
    </div>

<!--    <q-input label="Bucket name" filled v-model="advFilterBucketName" />-->
<!--    <q-input label="Field name" filled v-model="fieldName" />-->
<!--    <q-input label="Operation" filled v-model="operation" />-->
<!--    <q-input label="Value" filled v-model="" />-->

    <pre>{{ advancedFilters }}</pre>

    <template v-if="logsData.length">
      <div class="row full-width full-height">
        <q-table
          hide-pagination
          class="col-12"
          row-key="name"
          :columns="COLUMNS"
          :rows="logsData">
          <template v-slot:body-cell-event="props">
            <q-td :props="props">
              <pre>
                {{ JSON.stringify(props.row.event).substring(0, 40) }}...
              </pre>
            </q-td>
          </template>
        </q-table>

        <q-btn color="red">Previous</q-btn>
        <q-btn color="blue" @click.stop="nextPage">Next</q-btn>
      </div>
    </template>

    <template v-else>
      <NoData/>
    </template>
  </q-page>
</template>

<script lang="ts">
export default {
  name: 'LogsPage',
};
</script>

<script setup lang="ts">
import dayjs from 'dayjs';

import { isEmpty } from 'lodash';
import { onMounted, ref } from 'vue';
import { services } from 'src/services';

import NoData from './EmptyLogs.vue';

// ------------- //
// EMITS / PROPS //
// ------------- //

// ------- //
// GLOBALS //
// ------- //
const categoriesPagination = { page: 0, perPage: 10 };

// --------- //
// CONSTANTS //
// --------- //
const COLUMNS: any[] = [
  {
    name: 'event',
    required: true,
    label: 'Event',
    field: 'event',
    align: 'left',
  },
  {
    name: 'level',
    align: 'left',
    label: 'Lavel',
    field: 'level',
  },
  {
    name: 'category',
    align: 'left',
    label: 'Category',
    field: 'category',
  },
  {
    name: 'created',
    align: 'right',
    label: 'Created on',
    field: 'created',
  },
];
const LEVEL_OPTIONS = [
  { value: 'info', label: 'Information' },
  { value: 'warning', label: 'Warning' },
  { value: 'danger', label: 'Danger' },
];

// ----- //
// REF'S //
// ----- //
const levels = ref([]);
const logsData = ref([]);

const bucketName = ref('');
const advancedFilters = ref([]);

const categories = ref([]);
const categoriesOptions = ref([]);
const searchMoreCategories = ref(false);

const startDate = ref(
  dayjs()
    .subtract(1, 'hour')
    .format('YYYY/MM/DD HH:mm:ss'),
);

const endDate = ref(
  dayjs()
    .format('YYYY/MM/DD HH:mm:ss'),
);

// -------- //
// COMPUTED //
// -------- //

// ---------- //
// LIFE CYCLE //
// ---------- //
onMounted(async () => {
  await getLogs();
  await getCategories();
});

// ------- //
// METHODS //
// ------- //
/**
 * Pagination get next page
 */
async function nextPage() {
  const created = {
    start: dayjs(startDate.value).toISOString(),
    end: dayjs(endDate.value).toISOString(),
  };
  const [firstRegister] = logsData.value;

  // eslint-disable-next-line no-underscore-dangle
  const nextCursor = firstRegister._id as string;
  logsData.value = await services.logs.search({ created, nextCursor, limit: 10 });
}

/**
 * Get categories
 */
async function getCategories() {
  searchMoreCategories.value = true;
  categoriesPagination.page += 1;

  const { items: categoriesData } = await services.categories.find(categoriesPagination);

  categoriesOptions.value = categoriesData.map((category: any) => ({
    label: category.name,
    // eslint-disable-next-line no-underscore-dangle
    value: category._id,
  }));

  searchMoreCategories.value = false;
}

/**
 * Search logs
 */
async function getLogs() {
  const getValueBySelect = (
    selectedValues: { label: string, value: string }[],
  ) => selectedValues.map((level: any) => level.value);

  const payload: any = {
    limit: 10,
    created: {
      start: dayjs(startDate.value).toISOString(),
      end: dayjs(endDate.value).toISOString(),
    },
  };

  if (!isEmpty(levels.value)) payload.levels = getValueBySelect(levels.value);
  if (!isEmpty(categories.value)) payload.categories = getValueBySelect(categories.value);

  // if (!isEmpty(advancedFilters.value)) payload.filters = getValueBySelect(categories.value);
  logsData.value = await services.logs.search(payload);
}

</script>

<style lang="scss">
$header-height: 50px;
$padding-y: 32px;
$title-height: 50px + 48px; // 48px margin bottom

$used-area: $header-height + $padding-y + ($title-height * 2);

.q-table__card {
  box-shadow: none;
  border: 1px solid rgba($secondary, .3);
}

.logs-no-data {
  height: calc(100vh - #{$used-area}) !important;
}
</style>
