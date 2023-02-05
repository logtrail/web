<template>
  <q-page class="logs-page full-height">
    <div class="row full-width content-center items-center q-mb-xl">
      <p class="text-h3 col-grow q-mr-md q-mb-none">Logs</p>
    </div>

    <div class="row q-pb-sm full-width q-col-gutter-sm items-center logs-simple-filter">
      <div class="row col-12 col-md-6 col-lg-3">
        <LtInput
          v-model="startDate"
          readonly
          class="col"
          label="Start Date">
          <template v-slot:prepend>
            <q-icon
              class="cursor-pointer"
              name="event">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale">
                <q-date
                  v-model="startDate"
                  mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn
                      v-close-popup
                      flat
                      color="primary"
                      label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon
              class="cursor-pointer"
              name="access_time">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale">
                <q-time
                  v-model="startDate"
                  format24h
                  mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn
                      v-close-popup
                      flat
                      color="primary"
                      label="Close" />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </LtInput>
      </div>

      <div class="row col-12 col-md-6 col-lg-3">
        <LtInput
          v-model="endDate"
          readonly
          class="col"
          label="End Date">
          <template v-slot:prepend>
            <q-icon
              class="cursor-pointer"
              name="event">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale">
                <q-date
                  v-model="endDate"
                  mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn
                      v-close-popup
                      flat
                      color="primary"
                      label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon
              class="cursor-pointer"
              name="access_time">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale">
                <q-time
                  v-model="endDate"
                  format24h
                  mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn
                      v-close-popup
                      flat
                      color="primary"
                      label="Close" />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </LtInput>
      </div>

      <div class="row col-12 col-md-6 col-lg-3">
        <q-select
          v-model="levels"
          dense
          hide-bottom-space
          multiple
          no-error-icon
          outlined
          bg-color="white"
          class="col"
          label="Levels"
          :options="LEVEL_OPTIONS">
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>
                  <q-chip :color="scope.opt.color || 'grey-4'">
                    {{ scope.opt.label }}
                  </q-chip>
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>

          <template v-slot:selected>
            <div
              v-if="levels.length"
              class="row items-center">
              <q-chip
                dense
                :color="levels[0].color || 'grey-4'">
                {{ levels[0].label }}
              </q-chip>
              <q-chip
                v-if="levels.length > 1"
                dense>
                +{{ levels.length - 1 }}
              </q-chip>
            </div>
          </template>
        </q-select>
      </div>

      <div class="row col-12 col-md-6 col-lg-3">
        <LtSelect
          v-model="categories"
          multiple
          class="col"
          label="Categories"
          :loading="searchMoreCategories"
          :options="categoriesOptions"
          @virtual-scroll="getCategories">
          <template v-slot:selected>
            <div
              v-if="categories.length"
              class="row items-center">
              <q-chip dense>
                {{ categories[0].label }}
              </q-chip>
              <q-chip
                v-if="categories.length > 1"
                dense>
                +{{ categories.length - 1 }}
              </q-chip>
            </div>
          </template>
        </LtSelect>
      </div>

      <div class="row reverse full-width items-center q-col-gutter-sm">
        <div class="row col-shrink">
          <q-btn
            no-caps
            unelevated
            class="col"
            color="primary"
            label="Search"
            icon="search"
            @click.stop="getLogs" />
        </div>

        <div class="row col-shrink">
          <q-btn
            flat
            no-caps
            unelevated
            color="primary"
            class="col secondary-btn"
            icon="filter_alt"
            @click.stop="setAdvancedFilters">
            <p class="q-mb-none q-mx-sm">
              Advanced Search
            </p>
            <q-chip
              v-if="advancedFilters.length"
              dense
              color="primary">
              {{ advancedFilters.length }}
            </q-chip>
          </q-btn>
        </div>
      </div>
    </div>

    <template v-if="logsData.length">
      <div class="row full-width full-height">
        <q-table
          hide-pagination
          class="col-12"
          row-key="name"
          :columns="COLUMNS"
          :rows="logsData"
          :pagination="{ rowsPerPage: 10 }">
          <template v-slot:body-cell-event="props">
            <q-td :props="props">
              <pre>
                {{ JSON.stringify(props.row.event).substring(0, 40) }}...
              </pre>
            </q-td>
          </template>

          <template v-slot:body-cell-level="props">
            <q-td :props="props">
              <q-chip :color="getLevelColorByName(props.row.level) || 'grey-4'">
                {{ props.row.level }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-created="props">
            <q-td :props="props">
              {{ formatDate(props.row.created, 'YYYY/MM/DD HH:mm:ss') }}
            </q-td>
          </template>
        </q-table>

        <div class="row col-12 justify-center items-center q-col-gutter-sm q-mt-md">
          <div class="row col-shrink">
            <q-btn
              flat
              no-caps
              unelevated
              color="primary"
              class="col secondary-btn"
              icon="arrow_back"
              label="Previous"
              @click.stop="previousPage" />
          </div>

          <div class="row col-shrink">
            <q-btn
              no-caps
              unelevated
              color="primary"
              class="col"
              icon-right="arrow_forward"
              label="Next"
              @click.stop="nextPage" />
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <NoData />
    </template>

    <q-dialog
      v-model="advancedFiltersDialog"
      persistent>
      <div class="row full-width advanced-filters-card content-start">
        <div class="row col-12 justify-between items-center q-col-gutter-sm">
          <div class="row col-grow">
            <span class="col text-h5">Advanced Filters</span>
          </div>

          <div class="col-shrink">
            <q-btn
              dense
              flat
              no-caps
              round
              unelevated
              class="col"
              icon="close"
              @click="closeAdvancedFilters()" />
          </div>
        </div>

        <div class="row full-width advanced-filters-card_content q-col-gutter-sm">
          <p class="col-12 text-h6">Add new Filter</p>
          <div class="row col-6">
            <LtSelect
              v-model="fieldName"
              class="col"
              label="Field name"
              :options="fieldNameOptions"
              @update:model-value="changeOperationByFieldType" />
          </div>

          <div class="row col-6">
            <LtSelect
              v-model="operation"
              class="col"
              label="Operation"
              :options="operationOptions" />
          </div>

          <template v-if="fieldName?.bucketName === 'numberBucket'">
            <template v-if="operation?.value === 'range'">
              <div class="row col-3">
                <LtSelect
                  v-model="rangeStartOperation"
                  class="col"
                  label="Range start"
                  :options="numberOperations" />
              </div>
              <div class="row col-3">
                <LtInput
                  v-model="rangeStart"
                  class="col"
                  label="Range start" />
              </div>
              <div class="row col-3">
                <LtSelect
                  v-model="rangeEndOperation"
                  class="col"
                  label="Operation"
                  :options="numberOperations" />
              </div>
              <div class="row col-3">
                <LtInput
                  v-model="rangeEnd"
                  class="col"
                  label="Range end" />
              </div>
            </template>
          </template>

          <template v-if="fieldName?.bucketName === 'stringBucket'">
            <template v-if="operation?.value">
              <div class="row col-12">
                <LtInput
                  v-model="stringCompare"
                  class="col"
                  label="String to compare" />
              </div>
            </template>
          </template>

          <template v-if="fieldName?.bucketName === 'booleanBucket'">
            <template v-if="operation?.value">
              <div class="row col-12">
                <LtSelect
                  v-model="booleanCompare"
                  class="col"
                  label="Value to compare"
                  :options="booleanValues" />
              </div>
            </template>
          </template>

          <div class="row full-width justify-end">
            <q-btn
              flat
              no-caps
              unelevated
              class="col-shrink secondary-btn"
              color="primary"
              label="Add filter"
              icon="add"
              @click.stop="addNewAdvancedFilter" />
          </div>
        </div>

        <q-separator class="full-width q-mt-lg" />

        <template v-if="advancedFilters.length">
          <div class="row full-width advanced-filters-card_filter-list">
            <div class="row full-width">
              <div
                v-for="(filter, index) in advancedFilters"
                class="col-12 row advanced-filters-card_filter-list--item"
                :key="`filter-${index}`">
                <div class="row col">
                  <span class="col-12 text-weight-bold">
                    Field:
                  </span>
                  <span>
                    {{ filter.field }}
                  </span>
                </div>

                <div class="row col">
                  <span class="col-12 text-weight-bold">
                    Operation:
                  </span>
                  <span>
                    {{ mountOperation(filter) }}
                  </span>
                </div>

                <div class="row col">
                  <span class="col-12 text-weight-bold">
                    Value:
                  </span>
                  <span>
                    {{ mountValue(filter) }}
                  </span>
                </div>

                <div class="row col-shrink justify-end content-center">
                  <q-btn
                    dense
                    no-caps
                    unelevated
                    round
                    color="red"
                    class="content-start"
                    icon="delete"
                    @click="removeAdvancedFilter(index)" />
                </div>
              </div>
            </div>
          </div>

          <div class="row full-width justify-end q-mt-xl">
            <q-btn
              no-caps
              unelevated
              class="col-shrink"
              color="primary"
              label="Apply filters"
              icon="filter_list"
              @click.stop="closeAdvancedFilters" />
          </div>
        </template>

        <template v-else>
          <div class="row full-width q-mt-xl justify-center">
            <q-banner class="bg-grey-4 col-shrink rounded-borders">
              <span class="text-weight-medium">
                You don't have added filters yet!
              </span>
            </q-banner>
          </div>
        </template>
      </div>
    </q-dialog>
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

import LtInput from 'components/general/input/LtInput.vue';
import LtSelect from 'components/general/select/LtSelect.vue';
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
    label: 'Level',
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
    label: 'Created at',
    field: 'created',
  },
];

const LEVEL_OPTIONS = [
  { value: 'info', label: 'Information', color: 'info' },
  { value: 'warning', label: 'Warning', color: 'warning' },
  { value: 'danger', label: 'Danger', color: 'red-4' },
];

const numberOperations = [
  { label: 'Less than', value: 'lt' },
  { label: 'Less then or equal', value: 'lte' },
  { label: 'Greater than', value: 'gt' },
  { label: 'Greater than or equal', value: 'gte' },
];

const booleanValues = [
  { label: 'True', value: true },
  { label: 'False', value: false },
];

const ALL_OPERATIONS = {
  numberBucket: [
    { label: 'Range', value: 'range' },
  ],
  stringBucket: [
    { label: 'Contain', value: 'contain' },
    { label: 'Not contain', value: 'notContain' },
    { label: 'Start with', value: 'startWith' },
    { label: 'Equal', value: 'equal' },
  ],
  booleanBucket: [
    { label: 'Contain', value: 'contain' },
    { label: 'Not contain', value: 'notContain' },
  ],
};

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

const advFilterBucketName = ref(null);
const fieldName = ref(null);
const operation = ref(null);

const fieldNameOptions = ref([
  { label: 'serviceName', value: 'serviceName', bucketName: 'stringBucket' },
  { label: 'fileName', value: 'fileName', bucketName: 'stringBucket' },
  { label: 'message', value: 'message', bucketName: 'stringBucket' },
  { label: 'line', value: 'line', bucketName: 'numberBucket' },
  { label: 'data', value: 'data', bucketName: 'booleanBucket' },
]);

const operationOptions = ref([]);

const rangeStartOperation = ref(null);
const rangeStart = ref('');
const rangeEndOperation = ref(null);
const rangeEnd = ref('');

const stringCompare = ref('');
const booleanCompare = ref(null);

const advancedFiltersDialog = ref(false);

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

async function previousPage() {
  const created = {
    start: dayjs(startDate.value).toISOString(),
    end: dayjs(endDate.value).toISOString(),
  };
  const lastRegister = logsData.value.at(-1);

  // eslint-disable-next-line no-underscore-dangle
  const previousCursor = lastRegister._id as string;
  logsData.value = await services.logs.search({ created, previousCursor, limit: 10 });
}

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

function getLevelColorByName(level: string) {
  const { color: currentLevelOptionColor } = LEVEL_OPTIONS
    .find((levelOption) => levelOption.value === level) || {};

  return currentLevelOptionColor;
}

function setAdvancedFilters() {
  advancedFiltersDialog.value = true;
}

function closeAdvancedFilters() {
  advancedFiltersDialog.value = false;
}

function changeOperationByFieldType(value: any) {
  const { bucketName = 'stringBucket' } = value;

  operation.value = null;
  operationOptions.value = ALL_OPERATIONS[bucketName] || [];
}

function addNewAdvancedFilter() {
  const { value: fieldNameValue } = fieldName;
  const { value: operationValue } = operation;

  let payload = {};

  if (fieldNameValue.bucketName === 'stringBucket') {
    const { value: stringCompareValue } = stringCompare;

    payload = {
      field: fieldNameValue.value,
      operation: operationValue.value,
      value: stringCompareValue,
      bucketName: 'string',
    };
  }

  if (fieldNameValue.bucketName === 'numberBucket') {
    const { value: rangeStartValue } = rangeStart;
    const { value: rangeStartOperationValue } = rangeStartOperation;
    const { value: rangeEndValue } = rangeEnd;
    const { value: rangeEndOperationValue } = rangeEndOperation;

    payload = {
      field: fieldNameValue.value,
      operation: [rangeStartOperationValue.value, rangeEndOperationValue.value],
      value: [rangeStartValue, rangeEndValue],
      bucketName: 'number',
    };
  }

  if (fieldNameValue.bucketName === 'booleanBucket') {
    const { value: booleanCompareValue } = booleanCompare;

    payload = {
      field: fieldNameValue.value,
      operation: operationValue.value,
      value: booleanCompareValue.value,
      bucketName: 'boolean',
    };
  }

  advancedFilters.value.push(payload);

  resetAdvancedFiltersFields();
}

function resetAdvancedFiltersFields() {
  // general
  fieldName.value = null;
  operation.value = null;

  // number
  rangeStartOperation.value = null;
  rangeEndOperation.value = null;
  rangeStart.value = '';
  rangeEnd.value = '';

  // string
  stringCompare.value = '';

  // boolean
  booleanCompare.value = null;
}

function removeAdvancedFilter(index: number) {
  advancedFilters.value.splice(index, 1);
}

function applyAdvancedFilter() {
  //
}

function mountOperation(filter: any) {
  const { bucketName, operation } = filter;

  const operationLabel = {
    string: () => {
      const { label: stringOperationLabel } = ALL_OPERATIONS
        .stringBucket
        .find((stringOperation) => stringOperation.value === operation) || {};
      return stringOperationLabel;
    },
    number: () => {
      const newLabels = operation.map((currentOperation: any) => {
        const { label: numberOperationLabel } = numberOperations
          .find((numberOperation) => numberOperation.value === currentOperation) || {};

        return numberOperationLabel;
      });

      return newLabels.join(' - ');
    },
    boolean: () => {
      const { label: booleanOperationLabel } = ALL_OPERATIONS
        .booleanBucket
        .find((booleanOperation) => booleanOperation.value === operation) || {};
      return booleanOperationLabel;
    },
  };

  return operationLabel[bucketName]();
}

function mountValue(filter: any) {
  const { bucketName, value } = filter;

  const operationLabel = {
    string: () => value,
    number: () => value.join(' - '),
    boolean: () => (value ? 'True' : 'False'),
  };

  return operationLabel[bucketName]();
}

function formatDate(date: Date, format: string) {
  return dayjs(date).format(format);
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

.q-field {
  .q-chip {
    margin: 0 4px;
    font-size: 12px;
  }
}

.advanced-filters-card {
  background-color: #fff;
  padding: 16px;
  max-width: min(950px, 90%)!important;
  max-height: min(550px, 90vh)!important;
  height: min(550px, 90vh)!important;

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
</style>
