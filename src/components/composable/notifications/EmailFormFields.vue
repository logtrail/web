<template>
  <div class="row full-width q-col-gutter-y-md">
    <div class="row col-12">
      <q-select
        v-model="notificationPageStore.newNotification.options.accountType"
        v-bind="props.fieldProps"
        emit-value
        map-options
        class="col"
        label="Email account"
        :options="accountTypes"
        :rules="props.rules"
        @update:model-value="changeAccountType" />
    </div>

    <template v-if="notificationPageStore.newNotification.options.accountType === 'google'">
      <div class="row col-12">
        <q-input
          v-model="notificationPageStore.newNotification.options.user"
          v-bind="props.fieldProps"
          class="col"
          label="User"
          type="email"
          :rules="props.rules" />
      </div>

      <div class="row col-12">
        <q-input
          v-model="notificationPageStore.newNotification.options.password"
          v-bind="props.fieldProps"
          class="col"
          label="Password"
          type="password"
          :rules="props.rules" />
      </div>
    </template>

    <template v-else-if="notificationPageStore.newNotification.options.accountType === 'custom'">
      <div class="row col-12">
        <q-input
          v-model="notificationPageStore.newNotification.options.smtp"
          v-bind="props.fieldProps"
          stack-label
          class="col"
          label="Server name"
          placeholder="smtp.domain.com"
          :rules="props.rules">
          <template v-slot:append>
            <q-checkbox
              v-model="notificationPageStore.newNotification.options.useTLS"
              label="Use TLS"
              size="xs"
              @update:model-value="changeTLSoption" />
          </template>
        </q-input>
      </div>

      <div class="row col-12">
        <q-input
          v-model="notificationPageStore.newNotification.options.port"
          v-bind="props.fieldProps"
          stack-label
          class="col"
          label="Port"
          placeholder="587"
          :rules="props.rules" />
      </div>

      <div class="row col-12">
        <q-input
          v-model="notificationPageStore.newNotification.options.user"
          v-bind="props.fieldProps"
          class="col"
          label="User"
          :rules="props.rules"/>
      </div>

      <div class="row col-12">
        <q-input
          v-model="notificationPageStore.newNotification.options.password"
          v-bind="props.fieldProps"
          class="col"
          label="Password"
          type="password"
          :rules="props.rules" />
      </div>
    </template>
  </div>
</template>

<script setup>
import useNotificationPageStore from 'src/stores/pages/notificationsPage';

const notificationPageStore = useNotificationPageStore();

const props = defineProps({
  rules: {
    type: Array,
    default: () => [],
  },

  fieldProps: {
    type: Object,
    default: () => {},
  },
});

const accountTypes = [
  { label: 'Google', value: 'google' },
  { label: 'Custom', value: 'custom' },
];

function changeTLSoption(value) {
  const port = value ? 465 : 587;

  notificationPageStore.newNotification = {
    ...notificationPageStore.newNotification,
    options: {
      ...notificationPageStore.newNotification.options,
      port,
    },
  };
}

function changeAccountType(value) {
  const accountTypes = {
    google: () => {
      delete notificationPageStore.newNotification.options.smtp;
      delete notificationPageStore.newNotification.options.port;
      delete notificationPageStore.newNotification.options.useTLS;
    },
    custom: () => {
      notificationPageStore.newNotification.options.useTLS = false;
    },
  };

  accountTypes[value]();
}
</script>

<script>
export default {
  name: 'EmailFormFields.vue',
};
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
