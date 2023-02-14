<template>
  <q-page class="logs-page full-height">
    <div
      class="row full-width content-center items-center q-mb-xl"
      :class="$q.screen.lt.md ? 'q-col-gutter-y-sm' : 'q-col-gutter-sm'">
      <p class="text-h3 col-grow q-mr-md q-mb-none">Logs</p>
    </div>

    <div class="row full-width logs-simple-filter">

      <!-- STATIC FILTER -->
      <StaticFilters
        v-model:categories="categories"
        v-model:endDate="endDate"
        v-model:levels="levels"
        v-model:startDate="startDate" />

      <!-- ACTIONS -->
      <Actions
        v-model:statusModalAdvancedFilters="statusModalAdvancedFilters"
        :advanced-filters="advancedFilters"
        :getLogs="clickToGetLogs" />
    </div>

    <!-- LOG DATA -->
    <SearchResult
      v-if="logsData.length"
      :enableNextPage="enableNextPage"
      :enablePreviousPage="enablePreviousPage"
      :logsData="logsData"
      :nextPage="nextPage"
      :previousPage="previousPage" />

    <template v-else-if="loadingLogsData">
      <LoadCard />
    </template>

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
import { getValuesByMultiSelect, mongoIdToTimeStamp } from 'src/shared/helpers';

import NoData from 'components/general/banner/NoData.vue';
import LoadCard from 'components/general/card/loadCard/LoadCard.vue';
import StaticFilters from './components/StaticFilters.vue';
import AdvancedFilters from './components/AdvancedFilters.vue';
import Actions from './components/Actions.vue';
import SearchResult from './components/SearchResult.vue';

import { LogData } from './interfaces';
import { LIMIT_PER_PAGE } from './constants';

// ------- //
// GLOBALS //
// ------- //
let previousCursorId = '';
let nextCursorId = '';
const $q = useQuasar();

// ------ //
// STATES //
// ------ //

const levels = ref([]);
const logsData = ref<LogData[]>([]);
const advancedFilters = ref([]);

const loadingLogsData = ref<boolean>(false);

const categories = ref([]);

const enableNextPage = ref<boolean>(false);
const enablePreviousPage = ref<boolean>(false);
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
 * @async
 * @description Clear the previous cursor
 */
async function clickToGetLogs() {
  previousCursorId = '';
  await getLogs();
}

/**
 * @async
 * @description Search logs
 *
 * @param cursorData: { nextCursor?: string, previousCursor?: string } - Cursor data
 */
async function getLogs(
  cursorData: { nextCursor?: string, previousCursor?: string } = {},
) {
  loadingLogsData.value = true;
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

  const { items, hasNextCursor = false } = await services.logs.search(payload);
  logsData.value = items;

  if (!isEmpty(items)) {
    await Promise.all([
      checkStatusPreviousCursor(items),
      checkStatusNextCursor(items, hasNextCursor),
    ]);

    await nextTick();
    Prism.highlightAll();
  }

  loadingLogsData.value = false;
}

/**
 * @async
 * @description Previous page in cursor pagination
 */
async function previousPage() {
  const lastRegister = logsData.value[0];
  const previousCursor = lastRegister._id;
  await getLogs({ previousCursor });
}

/**
 * @async
 * @description Next page in cursor pagination
 */
async function nextPage() {
  const lastRegister = logsData.value[logsData.value.length - 1];
  const nextCursor = lastRegister._id;
  await getLogs({ nextCursor });
}

/**
 * @async
 * @description Check data to enable or disable previous btn
 *
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
 * @async
 * @description Check data to enable or disable next btn
 *
 * @param logsData: any[] - Logs
 * @param hasNextCursor: Boolean - Logs
 */
async function checkStatusNextCursor(logsData: any, hasNextCursor: boolean) {
  if (hasNextCursor) {
    const lastRegister = logsData[logsData.length - 1];
    const nextCursor = lastRegister._id;

    nextCursorId = nextCursor;
    enableNextPage.value = true;
  } else {
    const lastCursorTimeStamp = mongoIdToTimeStamp(nextCursorId);

    const lastRegister = logsData[logsData.length - 1];
    const currentCursorTimeStamp = mongoIdToTimeStamp(lastRegister._id);

    enableNextPage.value = lastCursorTimeStamp <= currentCursorTimeStamp;
  }
}

</script>

<style lang="scss" scoped>
.logs-simple-filter {
  margin-bottom: 32px;
}
</style>
