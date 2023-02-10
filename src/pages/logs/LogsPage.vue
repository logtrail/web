<template>
  <q-page class="logs-page full-height">
    <div class="row full-width content-center items-center q-mb-xl">
      <p class="text-h3 col-grow q-mr-md q-mb-none">Logs</p>
    </div>

    <div class="row full-width logs-simple-filter">

      <!-- STATIC FILTER -->
      <StaticFilters
        v-model:startDate="startDate"
        v-model:endDate="endDate"
        v-model:levels="levels"
        v-model:categories="categories "/>

      <!-- ACTIONS -->
      <Actions
        v-model:statusModalAdvancedFilters="statusModalAdvancedFilters"
        :advancedFilters="advancedFilters"
        :getLogs="clickToGetLogs"
        :advanced-filters="advancedFilters" />
    </div>

    <!-- LOG DATA -->
    <SearchResult
      v-if="logsData.length"
      :logsData="logsData"
      :enableNextPage="enableNextPage"
      :enablePreviousPage="enablePreviousPage"
      :previousPage="previousPage"
      :nextPage="nextPage"/>

    <!-- NO LOGS -->
    <template v-else>
      <NoData/>
    </template>

    <!-- DIALOG ADVANCED FILTERS -->
    <AdvancedFilters
      v-model:advancedFilters="advancedFilters"
      v-model:statusModalAdvancedFilters="statusModalAdvancedFilters" />
  </q-page>
</template>

<script lang="ts">
export default {
  name: 'LogsPage',
};
</script>

<script setup lang="ts">
import Prism from 'prismjs';
import 'prismjs/themes/prism.min.css';
import 'prismjs/components/prism-javascript';

import dayjs from 'dayjs';
import { useQuasar } from 'quasar';
import { isEmpty } from 'lodash';
import { nextTick, onMounted, ref } from 'vue';

import { services } from 'src/services';
import { getValuesByMultiSelect } from 'src/shared/helpers';

import NoData from 'components/general/banner/NoData.vue';
import StaticFilters from './components/StaticFilters.vue';
import AdvancedFilters from './components/AdvancedFilters.vue';
import Actions from './components/Actions.vue';
import SearchResult from './components/SearchResult.vue';

import { LIMIT_PER_PAGE } from './constants';

// ------- //
// GLOBALS //
// ------- //
let previousCursorId = '';
const $q = useQuasar();

// ------ //
// STATES //
// ------ //

const levels = ref([]);
const logsData = ref([]);
const advancedFilters = ref([]);

const categories = ref([]);

const enableNextPage = ref<boolean>(true);
const enablePreviousPage = ref<boolean>(true);
const statusModalAdvancedFilters = ref<boolean>(false);

const startDate = ref<string>(
  dayjs()
    .subtract(1, 'hour')
    .format('YYYY/MM/DD HH:mm:ss'),
);

const endDate = ref<string>(
  dayjs()
    .format('YYYY/MM/DD HH:mm:ss'),
);

// ---------- //
// LIFE CYCLE //
// ---------- //
onMounted(async () => {
  await getLogs();
});

// ------- //
// METHODS //
// ------- //

/**
 * Clear the previous cursor
 */
async function clickToGetLogs() {
  previousCursorId = '';
  await getLogs();
}

/**
 * Search logs
 * @param cursorData: { nextCursor?: string, previousCursor?: string } - Cursor data
 */
async function getLogs(
  cursorData: { nextCursor?: string, previousCursor?: string } = {},
) {
  const { nextCursor = '', previousCursor = '' } = cursorData;
  const payload: any = {
    limit: LIMIT_PER_PAGE,
    created: {
      start: dayjs(startDate.value).toISOString(),
      end: dayjs(endDate.value).toISOString(),
    },
  };

  // Filters
  if (!isEmpty(levels.value)) payload.levels = getValuesByMultiSelect(levels.value);
  if (!isEmpty(categories.value)) payload.categories = getValuesByMultiSelect(categories.value);
  if (!isEmpty(advancedFilters.value)) payload.filters = advancedFilters.value;

  // Cursor's
  if (!isEmpty(nextCursor)) payload.nextCursor = nextCursor;
  if (!isEmpty(previousCursor)) payload.previousCursor = previousCursor;

  const retData = await services.logs.search(payload);
  logsData.value = retData;

  if (!isEmpty(retData)) {
    await Promise.all([
      checkStatusPreviousCursor(retData),
      checkStatusNextCursor(retData),
    ]);

    await nextTick();
    Prism.highlightAll();
  }
}

/**
 * Previous page in cursor pagination
 */
async function previousPage() {
  const lastRegister = logsData.value[0];
  const previousCursor = lastRegister._id;
  await getLogs({ previousCursor });
}

/**
 * Next page in cursor pagination
 */
async function nextPage() {
  const lastRegister = logsData.value[logsData.value.length - 1];
  const nextCursor = lastRegister._id;
  await getLogs({ nextCursor });
}

/**
 * Check data to enable or disable previous btn
 * @param logsData: any[] - Logs
 */
async function checkStatusPreviousCursor(logsData: any[]) {
  if (isEmpty(previousCursorId)) {
    const lastRegister = logsData[0] ?? '';
    previousCursorId = lastRegister?._id ?? '';
    enablePreviousPage.value = false;
  } else {
    const isFirstPage = logsData.some((item: any) => item._id === previousCursorId);
    enablePreviousPage.value = !isFirstPage;
  }
}

/**
 * Check data to enable or disable next btn
 * @param logsData: any[] - Logs
 */
async function checkStatusNextCursor(logsData: any) {
  enableNextPage.value = true;
}

</script>

<style lang="scss">
$header-height: 50px;
$padding-y: 32px;
$title-height: 50px + 48px; // 48px margin bottom
$filters-height: 132px;

$used-area: $header-height + $padding-y + ($title-height * 2) + $filters-height;

.q-table__card {
  box-shadow: none;
  border: 1px solid rgba($secondary, .3);
}

.logs-no-data {
  height: calc(100vh - #{$used-area}) !important;
}

.q-field {
  .q-chip {
    margin: 0 4px;
    font-size: 12px;
  }
}

.advanced-filters-card {
  background-color: #fff;
  padding: 16px;
  max-width: min(950px, 90%) !important;
  max-height: min(550px, 90vh) !important;
  height: min(550px, 90vh) !important;

  &_content {
    margin-top: 32px;
  }

  &_filter-list {
    margin-top: 32px;

    &--item {
      padding: 4px 12px;
      border-radius: 4px;

      &:nth-child(odd) {
        background-color: $grey-2;
      }
    }
  }
}

.logs-simple-filter {
  margin-bottom: 32px;
}

code {
  background: $grey-2;
  color: $dark;
  word-wrap: break-word;
  box-decoration-break: clone;
  padding: .1rem .3rem .2rem;
  border-radius: .2rem;
  font-family: monospace;
}
</style>
