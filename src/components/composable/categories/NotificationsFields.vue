<template>
  <div class="full-width row q-col-gutter-y-md">
    <div
      v-for="(repeatableField, index) of notifications"
      class="notification-card row full-width q-my-md"
      :key="`notification-${index}`">
      <div class="notification-fields row col-12 q-col-gutter-y-md">
        <div class="row col-12 justify-between items-center">
          <span class="col-grow text-weight-bold">
            Notification {{ index + 1 }}
          </span>

          <div
            v-if="notifications.length > 1"
            class="row col-shrink">
            <q-btn
              dense
              no-caps
              unelevated
              round
              color="red-5"
              class="content-start"
              icon="delete"
              @click="removeNotification(index)" />
          </div>
        </div>

        <div class="col-12 row">
          <q-select
            v-model="repeatableField.notificationId"
            v-bind="props.fieldProps"
            emit-value
            map-options
            class="col"
            label="Notification type"
            :options="props.notificationOptions" />
        </div>

        <div class="col-12 row">
          <q-input
            v-model="repeatableField.destination"
            v-bind="props.fieldProps"
            class="col"
            label="Destination"/>
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
        label="New notification"
        @click="addNotificationField" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'NotificationsFields',
};
</script>

<script setup lang="ts">
/**
 * Impor LIBS / Components / Contants / etc..
 */
import { computed, defineEmits } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

/**
 * Define props
 */
const props = defineProps({
  fieldProps: {
    type: Object,
    default: () => {},
  },
  notificationOptions: {
    type: Array,
    default: () => [],
  },
  notifications: {
    type: Array,
    default: () => [],
  },
});

/**
 * Define emit
 */
const emit = defineEmits(['update:notifications']);

/**
 * Computed data
 */
const notifications = computed({
  get: () => props.notifications,
  set: (notification) => emit('update:notifications', notification),
});

/**
 * Add new notification
 */
function addNotificationField() {
  const add = { notificationId: '', destination: '' };
  notifications.value = [...notifications.value, add];
}

/**
 * Confirm to remove the notification
 * @param index: number - Array index
 */
function removeNotification(index: number) {
  const dialogProps = {
    title: 'Confirm',
    message: 'Would you like to delete this notification?',
    cancel: true,
    persistent: true,
  };

  $q.dialog(dialogProps)
    .onOk(async () => {
      const repeatableUpdated = notifications.value
        .filter((field, fieldIndex) => fieldIndex !== index);

      notifications.value = [...repeatableUpdated];
    })
    .onCancel(() => {
      // nothing here
    });
}
</script>
