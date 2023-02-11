<template>
  <div class="row full-width q-col-gutter-y-md">
    <div class="row col-12">
      <!-- CHOOSE NOTIFICATION TYPE-->
      <q-select
        v-model="formData.accountType"
        v-bind="props.fieldProps"
        emit-value
        map-options
        class="col"
        label="Email account"
        :options="accountTypes"
        :rules="props.rules"
        @update:model-value="changeAccountType" />
    </div>

    <!-- SMTP GOOGLE '-->
    <template v-if="formData.accountType === 'google'">
      <div class="row col-12">
        <q-input
          v-model="formData.user"
          v-bind="props.fieldProps"
          class="col"
          label="User"
          type="email"
          :rules="props.rules" />
      </div>

      <div class="row col-12">
        <q-input
          v-model="formData.password"
          v-bind="props.fieldProps"
          class="col"
          label="Password"
          type="password"
          :rules="props.rules" />
      </div>
    </template>

    <!-- CUSTOM SMTP -->
    <template v-else-if="formData.accountType === 'custom'">
      <div class="row col-12">
        <q-input
          v-model="formData.smtp"
          v-bind="props.fieldProps"
          stack-label
          class="col"
          label="Server name"
          placeholder="smtp.domain.com"
          :rules="props.rules">
          <template v-slot:append>
            <q-checkbox
              v-model="formData.useTLS"
              label="Use TLS"
              size="xs"
              @update:model-value="changeTLSoption" />
          </template>
        </q-input>
      </div>

      <div class="row col-12">
        <q-input
          v-model.number="formData.port"
          v-bind="props.fieldProps"
          stack-label
          class="col"
          label="Port"
          placeholder="587"
          :rules="props.rules" />
      </div>

      <div class="row col-12">
        <q-input
          v-model="formData.user"
          v-bind="props.fieldProps"
          class="col"
          label="User"
          :rules="props.rules"/>
      </div>

      <div class="row col-12">
        <q-input
          v-model="formData.password"
          v-bind="props.fieldProps"
          class="col"
          label="Password"
          type="password"
          :rules="props.rules" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'EmailFormFields.vue',
};
</script>

<script setup lang="ts">
/**
 * Impor LIBS / Components / Contants / etc..
 */
import { computed, reactive } from 'vue';
import useNotificationPageStore from 'src/stores/pages/notificationsPage';

/**
 * STATE AND CONSTANTS
 * @type {QVueGlobals}
 */
const accountTypes = [
  { label: 'Google', value: 'google' },
  { label: 'Custom', value: 'custom' },
];

/**
 * Define props
 */
const props = defineProps({
  rules: {
    type: Array,
    default: () => [],
  },
  fieldProps: {
    type: Object,
    default: () => {},
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

/**
 * Use TLS port
 * @param value:boolean - yes or not to use TLS
 */
function changeTLSoption(value: boolean) {
  const port = value ? 465 : 587;
  formData.value.port = port;
}

function changeAccountType(value: any) {
  // const accountTypes = {
  //   google: () => {
  //     delete formData.smtp;
  //     delete formData.port;
  //     delete formData.useTLS;
  //   },
  //   custom: () => {
  //     formData.useTLS = false;
  //   },
  // };
  //
  // accountTypes[value]();
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
