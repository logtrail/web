<template>
  <div class="row full-width q-px-md">
    <div class="row col-12 justify-between items-center q-mb-xl">
      <span class="text-h6 col-grow">{{ notificationTitle }}</span>
      <div class="col-shrink">
        <q-btn
          dense
          flat
          no-caps
          round
          unelevated
          class="col"
          icon="close"
          @click="closeNewNotification()" />
      </div>
    </div>

    <q-form
      greedy
      class="row full-width q-mt-md"
      ref="addNotificationForm">

      <div
        v-if="notificationPageStore.isEditingNotification"
        class="row col-12 q-mb-md q-px-none">
        <q-checkbox
          v-model="notificationPageStore.newNotification.enable"
          dense
          label="Enable notification"
          size="xs" />
      </div>

      <div class="row col-12 q-mb-md">
        <q-select
          v-model="notificationPageStore.newNotification.type"
          v-bind="fieldDefaultProps"
          emit-value
          map-options
          class="col"
          label="Notification type"
          :disable="notificationPageStore.isEditingNotification"
          :options="notificationTypes" />
      </div>

      <div class="row col-12 q-mb-md">
        <q-input
          v-model="notificationPageStore.newNotification.name"
          v-bind="fieldDefaultProps"
          class="col"
          label="Notification name"
          :rules="defaultRule" />
      </div>

      <EmailFormFields
        v-if="notificationPageStore.newNotification.type === 'email'"
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

<script setup>
import {
  defineAsyncComponent,
  ref,
  computed,
  onMounted,
} from 'vue';
import { useQuasar } from 'quasar';

import useNotificationPageStore from 'src/stores/pages/notificationsPage';

const $q = useQuasar();
const notificationPageStore = useNotificationPageStore();

const EmailFormFields = defineAsyncComponent(() => import('components/composable/notifications/EmailFormFields.vue'));

const notificationTypes = [
  { label: 'Discord', value: 'discord' },
  { label: 'Email', value: 'email' },
  { label: 'Slack', value: 'slack' },
  { label: 'Telegram', value: 'telegram' },
  { label: 'Teams', value: 'teams' },
];

const fieldDefaultProps = {
  outlined: true,
  dense: true,
  'bg-color': 'white',
  'no-error-icon': true,
  'hide-bottom-space': true,
};

const currentSelection = ref('');
const addNotificationForm = ref(null);

const notificationTitle = computed(() => {
  const { addingNotification, editingNotification } = notificationPageStore;

  if (addingNotification) return 'New notification';
  if (editingNotification) return 'Edit notification';

  return '';
});

const defaultRule = computed(() => ([
  (value) => !!value || 'Field is required',
]));

onMounted(() => {
  const { type: currentValueSelected } = notificationPageStore.newNotification;
  currentSelection.value = currentValueSelected;
});

function closeNewNotification() {
  notificationPageStore.clearNewNotification();
  addNotificationForm.value.reset();
}

async function addNotification() {
  const notificationHasJustCreated = await notificationPageStore.createNotification();

  if (notificationHasJustCreated) {
    $q.notify({
      type: 'positive',
      message: 'Done! Successfully to create notification',
      timeout: 5000,
    });

    addNotificationForm.value.reset();
    return;
  }

  $q.notify({
    type: 'negative',
    message: 'Oops! Something wrong!',
    caption: 'Wait some seconds and try again!',
    timeout: 5000,
  });
}

async function editNotification() {
  const notificationHasJustEdited = await notificationPageStore.updateNotification();

  if (notificationHasJustEdited) {
    $q.notify({
      type: 'positive',
      message: 'Done! Successfully to update notification',
      timeout: 5000,
    });

    addNotificationForm.value.reset();
    return;
  }

  $q.notify({
    type: 'negative',
    message: 'Oops! Something wrong!',
    caption: 'Wait some seconds and try again!',
    timeout: 5000,
  });
}

async function saveNotification() {
  const { addingNotification, editingNotification } = notificationPageStore;
  const { value: addNotificationFormReference = {} } = addNotificationForm;

  const result = await addNotificationFormReference?.validate().then((success) => success);

  if (!result) {
    $q.notify({
      type: 'negative',
      message: 'All fields must be valid to continue!',
      timeout: 5000,
    });
    return;
  }

  if (addingNotification) await addNotification();
  if (editingNotification) await editNotification();
}
</script>

<script>
export default {
  name: 'NotificationForm',
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
