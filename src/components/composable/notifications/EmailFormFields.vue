<template>
  <div class="row full-width q-col-gutter-y-md">
    <div class="row col-12">
      <q-input
        v-model="notificationPageStore.newNotification.name"
        v-bind="fieldDefaultProps"
        class="col"
        label="Notification name"
        :rules="defaultRule" />
    </div>

    <div class="row col-12">
      <q-select
        v-model="notificationPageStore.newNotification.options.accountType"
        v-bind="fieldDefaultProps"
        emit-value
        class="col"
        label="Email account"
        :options="accountTypes"
        :rules="defaultRule"
        @update:model-value="changeAccountType" />
    </div>

    <template v-if="notificationPageStore.newNotification.options.accountType === 'google'">
      <div class="row col-12">
        <q-input
          v-model="notificationPageStore.newNotification.options.user"
          v-bind="fieldDefaultProps"
          class="col"
          label="User"
          type="email"
          :rules="defaultRule" />
      </div>

      <div class="row col-12">
        <q-input
          v-model="notificationPageStore.newNotification.options.password"
          v-bind="fieldDefaultProps"
          class="col"
          label="Password"
          type="password"
          :rules="defaultRule" />
      </div>
    </template>

    <template v-else-if="notificationPageStore.newNotification.options.accountType === 'custom'">
      <div class="row col-12">
        <q-input
          v-model="notificationPageStore.newNotification.options.smtp"
          v-bind="fieldDefaultProps"
          stack-label
          class="col"
          label="Server name"
          placeholder="smtp.domain.com"
          :rules="defaultRule">
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
          v-bind="fieldDefaultProps"
          stack-label
          class="col"
          label="Port"
          placeholder="587"
          :rules="defaultRule" />
      </div>

      <div class="row col-12">
        <q-input
          v-model="notificationPageStore.newNotification.options.user"
          v-bind="fieldDefaultProps"
          class="col"
          label="User"
          :rules="defaultRule"/>
      </div>

      <div class="row col-12">
        <q-input
          v-model="notificationPageStore.newNotification.options.password"
          v-bind="fieldDefaultProps"
          class="col"
          label="Password"
          type="password"
          :rules="defaultRule" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import useNotificationPageStore from 'src/stores/pages/notificationsPage';

const notificationPageStore = useNotificationPageStore();

const accountTypes = [
  { label: 'Google', value: 'google' },
  { label: 'Custom', value: 'custom' },
];

const fieldDefaultProps = {
  outlined: true,
  dense: true,
  'bg-color': 'white',
  'no-error-icon': true,
  'hide-bottom-space': true,
};

const defaultRule = computed(() => ([
  (value) => !!value || 'Field is required',
]));

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
