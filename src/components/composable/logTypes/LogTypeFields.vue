<template>
  <div class="full-width row q-col-gutter-y-md">
    <div
      v-for="(repeatableField, index) of formData"
      class="logtype-card row full-width q-my-md"
      :key="`logTypeTransform-${index}`">

      <div class="logtype-fields row col-12 q-col-gutter-y-md">
        <div class="row col-12 justify-between items-center">
          <span class="col-grow text-weight-bold">
            Field {{ index + 1 }}
          </span>

          <div
            v-if="formData.length > 1"
            class="row col-shrink">
            <q-btn
              dense
              no-caps
              unelevated
              round
              color="red-5"
              class="content-start"
              icon="delete"
              @click="removeLogTypeField(index)" />
          </div>
        </div>

        <div class="col-12 row">
          <q-input
            v-model="repeatableField.from"
            v-bind="props.fieldProps"
            class="col-9 q-pr-xs"
            label="Field from"
            :rules="defaultRule">
          </q-input>

          <q-select
            v-model="repeatableField.fromType"
            v-bind="props.fieldProps"
            emit-value
            map-options
            class="col-3 q-pl-xs"
            label="Type"
            :options="fromTypes"
            :rules="defaultRule" />
        </div>

        <div class="col-12 row">
          <q-input
            v-model="repeatableField.to"
            v-bind="props.fieldProps"
            class="col"
            :rules="defaultRule"
            label="Field to" />
        </div>

        <div class="col-12 row">
          <q-select
            v-model="repeatableField.type"
            v-bind="props.fieldProps"
            emit-value
            map-options
            class="col"
            label="Value type"
            :rules="defaultRule"
            :options="typesFromLogType" />
        </div>
      </div>
    </div>

    <div class="row col-12">
      <q-btn
        no-caps
        flat
        unelevated
        color="primary"
        class="col-shrink secondary-btn"
        icon="add"
        label="New field"
        @click="addLogTypeField" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LogTypeFields',
};
</script>

<script setup lang="ts">
/**
 * Impor LIBS / Components / Contants / etc..
 */
import { computed, reactive } from 'vue';
import { useQuasar } from 'quasar';

/**
 * STATE AND CONSTANTS
 * @type {QVueGlobals}
 */
const $q = useQuasar();

const typesFromLogType = [
  { label: 'String', value: 'stringsBucket' },
  { label: 'Number', value: 'numbersBucket' },
  { label: 'Boolean', value: 'booleansBucket' },
  // { label: 'Date', value: 'dateBucket' },
  // { label: 'GeoPoints', value: 'geopointsBucket' },
];

const fromTypes = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
];

/**
 * Define props
 */
const props = defineProps({
  fieldProps: {
    type: Object,
    default: () => {},
  },
  formData: {
    type: Array,
    default: () => reactive([]),
  },
});

/**
 * Define emit
 */
const emit = defineEmits(['update:formData']);

/**
 * Computed data
 */
const formData = computed({
  get: () => props.formData,
  set: (formData) => emit('update:formData', formData),
});

const defaultRule = computed(() => ([
  (value: any) => !!value || 'Field is required',
]));

function addLogTypeField() {
  const newScheme = {
    from: '',
    to: '',
    type: null,
    fromType: '',
  };

  formData.value = [...formData.value, newScheme];
}

function removeLogTypeField(index: number) {
  const dialogProps = {
    title: 'Confirm',
    message: 'Would you like to delete this search scheme?',
    cancel: true,
    persistent: true,
  };

  $q.dialog(dialogProps)
    .onOk(async () => {
      const repeatableUpdated = formData.value
        .filter((field, fieldIndex) => fieldIndex !== index);

      formData.value = repeatableUpdated;
    })
    .onCancel(() => {
      // nothing here
    });
}
</script>

<style lang="scss">
.logtype-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
}
</style>
