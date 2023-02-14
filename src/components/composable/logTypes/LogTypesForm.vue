<template>
  <div class="row full-width q-pa-md">
    <q-form
      greedy
      class="row full-width q-mt-md"
      ref="refLogTypeForm">

      <div class="row col-12 q-mb-md">
        <q-input
          v-model="formData.name"
          v-bind="fieldDefaultProps"
          class="col"
          label="Search scheme name"
          :rules="defaultRule" />
      </div>

      <LogTypeFields
        v-model:formData="formData.fields"
        :field-props="fieldDefaultProps"
        :rules="defaultRule" />

      <q-separator class="full-width q-mt-lg" />

      <div class="row col-12 q-mt-lg">
        <q-btn
          no-caps
          unelevated
          color="primary"
          class="col-shrink"
          label="Save"
          @click="saveSearchScheme" />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LogTypesForm',
};
</script>

<script setup lang="ts">
/**
 * Impor LIBS / Components / Contants / etc..
 */
import {
  ref,
  computed,
  reactive,
} from 'vue';

import { useQuasar } from 'quasar';

import LogTypeFields from 'components/composable/logTypes/LogTypeFields.vue';

/**
 * STATE AND CONSTANTS
 * @type {QVueGlobals}
 */
const $q = useQuasar();

const fieldDefaultProps = {
  outlined: true,
  dense: true,
  'bg-color': 'white',
  'no-error-icon': true,
  'hide-bottom-space': true,
};

const refLogTypeForm = ref(null);

/**
 * Define props
 */
const props = defineProps({
  saveFormData: {
    type: Function,
    default: () => '',
  },
  formData: {
    type: Object,
    default: () => reactive({}),
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

/**
 * Save data
 */
async function saveSearchScheme() {
  const result = await refLogTypeForm.value?.validate();

  if (!result) {
    $q.notify({
      type: 'negative',
      message: 'All fields must be valid to continue!',
      timeout: 5000,
    });
    return;
  }

  await props.saveFormData();
  await refLogTypeForm.value?.resetValidation();
}
</script>

<style lang="scss">
</style>
