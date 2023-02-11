<template>
  <div class="row full-width q-px-md">
    <q-form
      greedy
      class="row full-width q-mt-md"
      ref="refNotificationForm">

      <div
        class="row col-12 q-mb-md q-px-none">
        <q-checkbox
          v-model="formData.enable"
          dense
          label="Enable notification"
          size="xs" />
      </div>

      <div class="row col-12 q-mb-md">
        <q-select
          v-model="formData.type"
          v-bind="fieldDefaultProps"
          emit-value
          map-options
          class="col"
          label="Notification type"
          :options="notificationTypes" />
      </div>

      <div class="row col-12 q-mb-md">
        <q-input
          v-model="formData.name"
          v-bind="fieldDefaultProps"
          class="col"
          label="Notification name"
          :rules="defaultRule" />
      </div>

      <EmailFormFields
        v-if="formData.type === 'email'"
        v-model:formData="formData.options"
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
          @click="saveNotification" />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
export default {
  name: 'NotificationForm',
};
</script>

<script setup lang="ts">
/**
 * Impor LIBS / Components / Contants / etc..
 */
import {
  defineAsyncComponent,
  ref,
  computed,
  onMounted,
  reactive,
} from 'vue';

import { useQuasar } from 'quasar';

const EmailFormFields = defineAsyncComponent(() => (
  import('components/composable/notifications/EmailFormFields.vue')
));

/**
 * STATE AND CONSTANTS
 * @type {QVueGlobals}
 */
const $q = useQuasar();
const notificationTypes = [
  { label: 'Email', value: 'email' },
];

const fieldDefaultProps = {
  outlined: true,
  dense: true,
  'bg-color': 'white',
  'no-error-icon': true,
  'hide-bottom-space': true,
};

const refNotificationForm = ref(null);

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

onMounted(() => {
});

async function saveNotification() {
  const result = await refNotificationForm.value?.validate();

  if (!result) {
    $q.notify({
      type: 'negative',
      message: 'All fields must be valid to continue!',
      timeout: 5000,
    });
    return;
  }

  await props.saveFormData();
  await refNotificationForm.value?.resetValidation();
}
</script>

<style lang="scss">
.q-field {
  &__append {
    .q-checkbox__label {
      font-size: 12px!important;
    }
  }
}
</style>
