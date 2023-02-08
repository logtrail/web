<template>
  <q-page class="logs-page full-height">
    <div class="row full-width content-center items-center q-mb-xl">
      <p class="text-h3 col-grow q-mr-md q-mb-none">Logs</p>
    </div>

    <div class="row full-width logs-simple-filter">
      <div class="row full-width q-col-gutter-sm items-center q-pb-sm">
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
      </div>

      <div class="row reverse full-width items-center q-col-gutter-sm">
        <div class="row col-12 col-md-shrink">
          <q-btn
            no-caps
            unelevated
            class="col"
            color="primary"
            label="Search"
            icon="search"
            @click.stop="getLogs" />
        </div>

        <div class="row col-12 col-md-shrink">
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
          row-key="_id"
          :columns="COLUMNS"
          :pagination="{ rowsPerPage: 10 }"
          :rows="logsData">
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
                :key="col.name"
                :props="props"
                @click.stop="props.expand = !props.expand">
                <code v-if="col.name === 'event'">{{ getPartialFromEventValue(col.value) }}</code>
                <q-chip
                  v-if="col.name === 'level'"
                  :color="getLevelColorByName(col.value) || 'grey-4'">
                  {{ col.value }}
                </q-chip>
                <span v-if="col.name === 'created'">
                  {{ formatDate(col.value, 'YYYY/MM/DD HH:mm:ss') }}
                </span>
                <span v-if="col.name === 'category'">
                  {{ col.value }}
                </span>
              </q-td>
            </q-tr>

            <q-tr
              auto-width
              :key="props.row._id"
              v-show="props.expand"
              :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <p class="text-h6">Event details</p>
                  <pre class="language-javascript"><code>{{ props.row.event }}</code></pre>
                </div>
              </q-td>
            </q-tr>
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
            {{ logsData[0]?._id }}
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
              {{ logsData[logsData.length - 1]?._id }}
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
          <p class="col-12 text-h6 q-mb-xs">Add new Filter</p>
          <div class="row col-6">
            <LtSelect
              v-model="searchScheme"
              class="col"
              label="Search schemes"
              hint="You need to select at least one search scheme"
              :options="searchSchemeOptions"
              @update:model-value="fieldsToAdvancedFilter"
              @virtual-scroll="getSearchSchemes"/>
          </div>

          <div class="row col-12 q-col-gutter-sm">
            <div class="row col-6">
              <LtSelect
                v-model="fieldName"
                class="col"
                label="Field name"
                :disable="searchScheme.length === 0"
                :options="fieldNameOptions"
                @update:model-value="changeOperationByFieldType" />
            </div>
            <div class="row col-6">
              <LtSelect
                v-model="operation"
                class="col"
                label="Operation"
                :disable="searchScheme.length === 0"
                :options="operationOptions" />
            </div>
          </div>

          <template v-if="fieldName?.bucketName === 'numbersBucket'">
            <template v-if="operation?.value === 'range'">
              <div class="row col-3">
                <LtSelect
                  v-model="rangeStartOperation"
                  class="col"
                  label="Range start"
                  :options="NUMBER_OPERATIONS" />
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
                  :options="NUMBER_OPERATIONS" />
              </div>
              <div class="row col-3">
                <LtInput
                  v-model="rangeEnd"
                  class="col"
                  label="Range end" />
              </div>
            </template>

            <template v-if="operation?.value === 'equal'">
              <div class="row col-12">
                <LtInput
                  v-model="numberEqual"
                  class="col"
                  label="Equal value"/>
              </div>
            </template>
          </template>

          <template v-if="fieldName?.bucketName === 'stringsBucket'">
            <template v-if="operation?.value">
              <div class="row col-12">
                <LtInput
                  v-model="stringCompare"
                  class="col"
                  label="String to compare" />
              </div>
            </template>
          </template>

          <template v-if="fieldName?.bucketName === 'booleansBucket'">
            <template v-if="operation?.value">
              <div class="row col-12">
                <LtSelect
                  v-model="booleanCompare"
                  class="col"
                  label="Value to compare"
                  :options="BOOLEAN_VALUES" />
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
                  <span v-html="mountValue(filter)" />
                </div>

                <div class="row col-shrink justify-end content-center">
                  <q-btn
                    dense
                    no-caps
                    unelevated
                    round
                    color="red-5"
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
import Prism from 'prismjs';
import 'prismjs/themes/prism.min.css';
import 'prismjs/components/prism-javascript';

import dayjs from 'dayjs';
import { QSelectOption, useQuasar } from 'quasar';
import { isEmpty } from 'lodash';
import { nextTick, onMounted, ref } from 'vue';

import { services } from 'src/services';

import LtInput from 'components/general/input/LtInput.vue';
import LtSelect from 'components/general/select/LtSelect.vue';
import NoData from 'components/general/banner/NoData.vue';

import { LEVEL_OPTIONS, LIMIT_PER_PAGE } from 'src/shared/constants';
imo

import {
  OperationOptions,
  FieldName,
  SearchScheme,
  ItemSearchScheme,
} from './interfaces';

import {
  COLUMNS,
  NUMBER_OPERATIONS,
  BOOLEAN_VALUES,
  ALL_OPERATIONS,
} from './constants';

// ------- //
// GLOBALS //
// ------- //
const $q = useQuasar();
const categoriesPagination = { page: 0, perPage: 10 };
const searchSchemePagination = { page: 0, perPage: 10 };

// ----- //
// REF'S //
// ----- //
const levels = ref([]);
const logsData = ref([]);
const advancedFilters = ref([]);

const categories = ref([]);
const categoriesOptions = ref([]);
const searchMoreCategories = ref<boolean>(false);

const searchScheme = ref<SearchScheme | []>([]);
const searchSchemeOptions = ref<SearchScheme[] | []>([]);
const searchMoreSearchSchemes = ref<boolean>(false);

const fieldName = ref<FieldName | null>(null);
const operation = ref<QSelectOption | null>(null);

const fieldNameOptions = ref<FieldName[]>([]);
const operationOptions = ref<OperationOptions | []>([]);

const numberEqual = ref<number>(0);
const rangeStartOperation = ref<any>(null);
const rangeStart = ref<string>('');
const rangeEndOperation = ref<any>(null);
const rangeEnd = ref<string>('');

const stringCompare = ref<string>('');
const booleanCompare = ref<any>(null);

const advancedFiltersDialog = ref<boolean>(false);

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
  await getCategories();
});

// ------- //
// METHODS //
// ------- //

/**
 * Previous page in cursor pagination
 */
async function previousPage() {
  const created = {
    start: dayjs(startDate.value).toISOString(),
    end: dayjs(endDate.value).toISOString(),
  };
  const lastRegister = logsData.value[0];
  const previousCursor = lastRegister._id;
  logsData.value = await services.logs.search({
    created,
    previousCursor,
    limit: LIMIT_PER_PAGE,
    filters: advancedFilters.value,
  });

  await nextTick();
  Prism.highlightAll();
}

/**
 * Next page in cursor pagination
 */
async function nextPage() {
  const lastRegister = logsData.value[logsData.value.length - 1];
  const nextCursor = lastRegister._id;

  const payload = {
    nextCursor,

    created: {
      start: dayjs(startDate.value).toISOString(),
      end: dayjs(endDate.value).toISOString(),
    }
  } as any;


  if (!isEmpty(levels.value)) payload.levels = getValueBySelect(levels.value);
  if (!isEmpty(categories.value)) payload.categories = getValueBySelect(categories.value);
  if (!isEmpty(advancedFilters.value)) payload.filters = advancedFilters.value;

  logsData.value = await services.logs.search(payload);

  await nextTick();
  Prism.highlightAll();



  logsData.value = await services.logs.search({
    created,
    nextCursor,
    limit: LIMIT_PER_PAGE,
    filters: advancedFilters.value,
  });

  await nextTick();
  Prism.highlightAll();
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
    logTypeId: category.logTypeId,
  }));

  searchMoreCategories.value = false;
}

/**
 * Get categories
 */
async function getSearchSchemes() {
  searchSchemePagination.value = true;
  categoriesPagination.page += 1;

  const { items: searchSchemeData } = await services.searchSchemas.find(categoriesPagination);

  searchSchemeOptions.value = searchSchemeData.map((item: any) => ({
    label: item.name,
    value: item.fields,
  }));

  searchSchemePagination.value = false;
}

/**
 * Search logs
 */
async function getLogs() {
  const payload: any = {
    limit: LIMIT_PER_PAGE,
    created: {
      start: dayjs(startDate.value).toISOString(),
      end: dayjs(endDate.value).toISOString(),
    },
  };

  if (!isEmpty(levels.value)) payload.levels = getValueBySelect(levels.value);
  if (!isEmpty(categories.value)) payload.categories = getValueBySelect(categories.value);
  if (!isEmpty(advancedFilters.value)) payload.filters = advancedFilters.value;

  logsData.value = await services.logs.search(payload);

  await nextTick();
  Prism.highlightAll();
}

/**
 * Get color by level
 * @param level: string - Level name
 */
function getLevelColorByName(level: string) {
  const { color: currentLevelOptionColor } = LEVEL_OPTIONS
    .find((levelOption) => levelOption.value === level) || {};

  return currentLevelOptionColor;
}

/**
 * Set advanced filter
 */
async function setAdvancedFilters() {
  await getSearchSchemes();
  advancedFiltersDialog.value = true;
}

/**
 * Close modal advanced filter
 */
function closeAdvancedFilters() {
  advancedFiltersDialog.value = false;
}

/**
 * Change operation type by field type
 * @param value: { label: string, value: string, bucketName: string } - Operation value
 */
function changeOperationByFieldType(value: any) {
  const { bucketName = 'stringsBucket' } = value;

  operation.value = null;
  const retData = ALL_OPERATIONS[bucketName as keyof typeof ALL_OPERATIONS] || [];
  operationOptions.value = retData;
}

/**
 * Add new filter in array of filters
 */
function addNewAdvancedFilter() {
  const { value: fieldNameValue } = fieldName;
  const { value: operationValue } = operation;

  let payload = {};

  if (fieldNameValue?.bucketName === 'stringsBucket') {
    const { value: stringCompareValue } = stringCompare;

    payload = {
      field: fieldNameValue.value,
      operation: operationValue?.value,
      value: stringCompareValue,
      bucketName: 'string',
    };
  }

  if (fieldNameValue?.bucketName === 'numbersBucket') {
    const { value: operationValue } = operation.value;

    if (operationValue === 'range') {
      const { value: rangeStartValue } = rangeStart;
      const { value: rangeStartOperationValue } = rangeStartOperation;
      const { value: rangeEndValue } = rangeEnd;
      const { value: rangeEndOperationValue } = rangeEndOperation;

      payload = {
        bucketName: 'number',
        operation: 'range',
        field: fieldNameValue?.value,
        value: {
          [rangeStartOperationValue?.value]: Number(rangeStartValue),
          [rangeEndOperationValue?.value]: Number(rangeEndValue),
        },
      };
    } else if (operationValue === 'equal') {
      payload = {
        bucketName: 'number',
        operation: 'equal',
        field: fieldNameValue?.value,
        value: Number(numberEqual.value),
      };
    }
  }

  if (fieldNameValue?.bucketName === 'booleansBucket') {
    const { value: booleanCompareValue } = booleanCompare;

    payload = {
      field: fieldNameValue?.value,
      operation: operationValue?.value,
      value: booleanCompareValue?.value,
      bucketName: 'boolean',
    };
  }

  advancedFilters.value.push(payload);
  resetAdvancedFiltersFields();
}

/**
 * Filters reset
 */
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

/**
 * Remove one filter by index array
 * @param index: number - Array index number
 */
function removeAdvancedFilter(index: number) {
  advancedFilters.value.splice(index, 1);
}

/**
 * Mount operation label
 * @param filter: * @param value: { bucketName: string, operation: string }
 * Bucket and operation value
 */
function mountOperation(filter: any) {
  const { bucketName, operation } = filter;

  const operationLabel = {
    string: () => {
      const { label: stringOperationLabel } = ALL_OPERATIONS
        .stringsBucket
        .find((stringOperation) => stringOperation.value === operation) || {};
      return stringOperationLabel;
    },
    number: () => {
      const { label: numberOperationLabel } = ALL_OPERATIONS
        .numbersBucket
        .find((numberOperation) => numberOperation.value === operation) || {};
      return numberOperationLabel;
    },
    boolean: () => {
      const { label: booleanOperationLabel } = ALL_OPERATIONS
        .booleansBucket
        .find((booleanOperation) => booleanOperation.value === operation) || {};
      return booleanOperationLabel;
    },
  };

  return operationLabel[bucketName as keyof typeof operationLabel]();
}

/**
 * Mount operation value
 * @param filter: * @param value: { bucketName: string, operation: string }
 * Bucket and operation value
 */
function mountValue(filter: any) {
  const { bucketName, value, operation } = filter;

  const operationValue = {
    string: () => value,
    number: () => {
      if (operation === 'equal') return value;

      // Range
      const newLabels = Object.keys(value).map((key: string) => {
        const currentValue = value[key];
        const { label: numberOperationLabel } = NUMBER_OPERATIONS
          .find((numberOperation) => numberOperation.value === key) || {};

        return `${numberOperationLabel}: ${currentValue}`;
      });

      return newLabels.join('<br>');
    },
    boolean: () => (value ? 'True' : 'False'),
  };

  return operationValue[bucketName as keyof typeof operationValue]();
}

/**
 * Format date
 * @param date: Date - Date to format
 * @param format: string - Format type
 */
function formatDate(date: Date, format: string) {
  return dayjs(date).format(format);
}

/**
 * Mount advanced filters
 * @param fields: ItemSearchScheme[] - Schema from to
 */
async function mountFieldsToAdvancedFilters(fields: ItemSearchScheme[]) {
  return fields.reduce((mounted: any, fieldData: any) => {
    const { type, to } = fieldData;
    return [
      ...mounted,
      {
        bucketName: type,
        label: to,
        value: to,
      },
    ];
  }, []);
}

/**
 * Mount fields to advanced filter
 * @param event: any - Event
 * @param type: string - Add ou remove element
 */
async function fieldsToAdvancedFilter(event: any) {
  const { value: fields } = event;
  fieldNameOptions.value = await mountFieldsToAdvancedFilters(fields);
}

function getPartialFromEventValue(value: string) {
  let maxSize = 80;

  if ($q.screen.lt.sm) maxSize = 35;
  if ($q.screen.lt.md) maxSize = 45;
  if ($q.screen.lt.lg) maxSize = 55;

  const newText = JSON.stringify(value).substring(0, maxSize);
  return `${newText}...`;
}

// function eventFormatted(event: object) {
//   const eventString = JSON.stringify(event);
//   const html = Prism.highlight(eventString, Prism.languages.javascript, 'javascript');
//   return html;
// }
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
