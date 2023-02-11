<template>
  <q-dialog
    persistent
    :model-value="props.statusModalAdvancedFilters">
    <div class="row full-width advanced-filters-card content-start">
      <!-- HEADER -->
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
            @click="closeAdvancedFilters()"/>
        </div>
      </div>

      <div class="row full-width advanced-filters-card_content q-col-gutter-sm">
        <p class="col-12 text-h6 q-mb-xs">Add new Filter</p>

        <!-- SEARCH SCHEME -->
        <div class="row col-6">
          <LtSelect
            v-model="searchScheme"
            class="col"
            label="Search schemes"
            hint="You need to select at least one search scheme"
            :virtual-scroll-item-size="VIRTUAL_SCROLL_ITEM_SIZE"
            :popup-content-style="{ 'max-height': `${VIRTUAL_SCROLL_ITEM_SIZE}px` }"
            :options="searchSchemesOptions"
            @update:model-value="fieldsToAdvancedFilter"
            @virtual-scroll="getSearchSchemeByNextPage"/>
        </div>

        <div class="row col-12 q-col-gutter-sm">
          <!-- FIELD NAME -->
          <div class="row col-6">
            <LtSelect
              v-model="fieldName"
              class="col"
              label="Field name"
              :disable="!searchScheme?.fields"
              :options="fieldNameOptions"
              @update:model-value="changeOperationByFieldType"/>
          </div>

          <!-- OPERATION -->
          <div class="row col-6">
            <LtSelect
              v-model="operation"
              class="col"
              label="Operation"
              :disable="!fieldName?.value"
              :options="operationOptions"/>
          </div>
        </div>

        <!-- VALUE -->
        <template v-if="fieldName?.bucketName === 'numbersBucket'">
          <template v-if="operation?.value === 'range'">
            <div class="row col-3">
              <LtSelect
                v-model="rangeStartOperation"
                class="col"
                label="Range start"
                :options="NUMBER_OPERATIONS"/>
            </div>
            <div class="row col-3">
              <LtInput
                v-model="rangeStart"
                class="col"
                label="Range start"/>
            </div>
            <div class="row col-3">
              <LtSelect
                v-model="rangeEndOperation"
                class="col"
                label="Operation"
                :options="NUMBER_OPERATIONS"/>
            </div>
            <div class="row col-3">
              <LtInput
                v-model="rangeEnd"
                class="col"
                label="Range end"/>
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

        <!-- VALUE -->
        <template v-if="fieldName?.bucketName === 'stringsBucket'">
          <template v-if="operation?.value">
            <div class="row col-12">
              <LtInput
                v-model="stringCompare"
                class="col"
                label="String to compare"/>
            </div>
          </template>
        </template>

        <!-- VALUE -->
        <template v-if="fieldName?.bucketName === 'booleansBucket'">
          <template v-if="operation?.value">
            <div class="row col-12">
              <LtSelect
                v-model="booleanCompare"
                class="col"
                label="Value to compare"
                :options="BOOLEAN_VALUES"/>
            </div>
          </template>
        </template>

        <!-- ADD NEW FILTER -->
        <div class="row full-width justify-end">
          <q-btn
            flat
            no-caps
            unelevated
            class="col-shrink secondary-btn"
            color="primary"
            label="Add filter"
            icon="add"
            :disable="!operation?.value"
            @click.stop="addNewAdvancedFilter"/>
        </div>
      </div>

      <q-separator class="full-width q-mt-lg"/>

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
                <span v-html="mountValue(filter)"/>
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
                  @click="removeAdvancedFilter(index)"/>
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
            @click.stop="applyAdvancedFilters"/>
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
</template>

<script lang="ts">
export default { name: 'AdvancedFilters' };
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { QSelectOption } from 'quasar';

import LtInput from 'components/general/input/LtInput.vue';
import LtSelect from 'components/general/select/LtSelect.vue';

import { useSearchScheme } from 'src/composables';

import { VIRTUAL_SCROLL_ITEM_SIZE } from 'src/shared/constants';

import {
  OperationOptions,
  FieldName,
  ItemSearchScheme,
} from '../interfaces';

import {
  NUMBER_OPERATIONS,
  BOOLEAN_VALUES,
  ALL_OPERATIONS,
} from '../constants';

const {
  searchSchemesOptions,
  getSearchSchemeByNextPage,
} = useSearchScheme();

/**
 * Props you can use
 */
const props = defineProps({
  statusModalAdvancedFilters: {
    type: Boolean,
  },
  advancedFilters: {
    type: Array,
  },
});

/**
 * Emit to parent
 */
const emit = defineEmits([
  'update:statusModalAdvancedFilters',
  'update:advancedFilters',
]);

// -------//
// STATES //
// -------//
const fieldName = ref<FieldName | null>(null);
const operation = ref<QSelectOption | null>(null);

const fieldNameOptions = ref<FieldName[]>([]);
const operationOptions = ref<QSelectOption[]>([]);

const numberEqual = ref<number>(0);
const rangeStartOperation = ref<any>(null);
const rangeStart = ref<string>('');
const rangeEndOperation = ref<any>(null);
const rangeEnd = ref<string>('');

const stringCompare = ref<string>('');
const booleanCompare = ref<any>(null);

const searchScheme = ref<never | {}>();
const advancedFilters = ref<Record<string, any>[]>([]);

// -------- //
// METHODS
// -------- //

/**
 * Close advanced filters and clean filters
 */
function closeAdvancedFilters() {
  emit('update:advancedFilters', []);
  emit('update:statusModalAdvancedFilters', false);
}

/**
 * Apply filter in query and close modal
 */
function applyAdvancedFilters() {
  emit('update:advancedFilters', advancedFilters.value);
  emit('update:statusModalAdvancedFilters', false);
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
  const { value } = event;
  const { fields } = searchSchemesOptions.value.find((item: any) => item.value === value) as any;
  fieldNameOptions.value = await mountFieldsToAdvancedFilters(fields);
}
</script>
