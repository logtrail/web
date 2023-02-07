<template>
  <div class="full-width row q-col-gutter-y-md">
    <div
      v-for="(repeatableField, index) of repeatableFields"
      class="notification-card row full-width q-my-md"
      :key="`notification-${index}`">
      <div class="notification-fields row col-12 q-col-gutter-y-md">
        <div class="row col-12 justify-between items-center">
          <span class="col-grow text-weight-bold">
            Notification {{ index + 1 }}
          </span>

          <div
            v-if="repeatableFields.length > 1"
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
            :options="props.notificationOptions"
            :rules="defaultRule" />
        </div>

        <div class="col-12 row">
          <q-input
            v-model="repeatableField.destination"
            v-bind="props.fieldProps"
            class="col"
            label="Destination"
            :rules="defaultRule" />
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
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import useCategoryPageStore from 'src/stores/pages/categoriesPage';

const $q = useQuasar();

const categoriesPageStore = useCategoryPageStore();

const props = defineProps({
  fieldProps: {
    type: Object,
    default: () => {},
  },

  notificationOptions: {
    type: Array,
    default: () => [],
  },
});

const repeatableFields = computed(() => categoriesPageStore.newCategory.notifications);

const defaultRule = computed(() => ([
  (value: any) => !!value || 'Field is required',
]));

function addNotificationField() {
  categoriesPageStore.newCategory.notifications.push({
    notificationId: '',
    destination: '',
  });
}

function removeNotification(index: number) {
  const dialogProps = {
    title: 'Confirm',
    message: 'Would you like to delete this notification?',
    cancel: true,
    persistent: true,
  };

  $q.dialog(dialogProps)
    .onOk(async () => {
      const repeatableUpdated = categoriesPageStore.newCategory.notifications
        .filter((field, fieldIndex) => fieldIndex !== index);

      categoriesPageStore.newCategory.notifications = [...repeatableUpdated];
    })
    .onCancel(() => {
      // nothing here
    });
}
</script>

<style lang="scss">
</style>
