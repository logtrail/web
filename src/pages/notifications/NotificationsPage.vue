<template>
  <q-page class="notifications-page full-height">
    <div class="row full-width content-center items-center q-mb-xl">
      <p class="text-h3 col-shrink q-mr-md q-mb-none">Notifications</p>
      <q-btn
        v-if="notificationPageStore.notificationsList.length"
        dense
        no-caps
        unelevated
        class="col-shrink btn-primary bg-primary text-secondary"
        icon="add"
        label="New notification"
        padding="xs sm"
        @click="addNotification()" />
    </div>

    <div class="row full-width full-height">
      <template v-if="notificationPageStore.notificationsList.length">
        <q-table
          v-model:pagination="pagination"
          hide-pagination
          class="col-12"
          row-key="name"
          :columns="columns"
          :filter="filter"
          :rows="notificationPageStore.notificationsList">
          <template v-slot:top-right>
            <q-input
              v-model="filter"
              dense
              outlined
              debounce="300"
              placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body-cell-enable="props">
            <q-td :props="props">
              <q-icon
                name="fiber_manual_record"
                :color="props.row.enable ? 'green' : 'red'" />
                {{ props.row.enable ? 'Enable' : 'Disable' }}
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div class="row justify-end">
                <q-btn
                  dense
                  round
                  unelevated
                  class="q-mr-xs"
                  color="blue"
                  @click="editNotification(props.row._id)">
                  <q-icon
                    name="edit"
                    color="white"
                    size="18px" />
                </q-btn>

                <q-btn
                  dense
                  round
                  unelevated
                  class="q-ml-xs"
                  color="red"
                  @click="removeNotification(props.row._id)">
                  <q-icon
                    name="delete_forever"
                    color="white"
                    size="18px" />
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>

        <div class="row justify-center q-mt-md full-width">
          <q-pagination
            v-model="pagination.page"
            color="secondary"
            size="md"
            :max="pagesNumber" />
        </div>
      </template>

      <template v-else>
        <div class="row col-12 justify-center items-center notification-no-data">
          <div class="col-12 text-center">
            <img src="img/empty-notification.svg" width="250" height="250" alt="">
            <p class="q-mt-md text-weight-bold">
              Wait! You don't have notifications accounts yet! Try to add new notification accounts.
            </p>
            <q-btn
              dense
              no-caps
              unelevated
              class="col-shrink btn-primary bg-primary text-secondary text-weight-bold"
              icon="add"
              label="New notification"
              padding="xs sm"
              @click="addNotification()" />
          </div>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script lang="ts">
export default {
  name: 'NotificationsPage',
};
</script>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { isEmpty } from 'lodash';

import { services } from 'src/services';

import useNotificationPageStore from 'stores/pages/notificationsPage';
import { ColumnTypes } from './types';

onMounted(async () => {
  // const nada = await services.notifications.find();
});

const $q = useQuasar();
const notificationPageStore = useNotificationPageStore();

const filter = ref('');

const addNotification = () => {
  notificationPageStore.setAddingNotification(true);
};

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  // rowsNumber: xx if getting data from a server
});

const pagesNumber = computed(() => {
  const { notificationsList = [] } = notificationPageStore;
  return Math.ceil(notificationsList.length / pagination.value.rowsPerPage);
});

const columns: ColumnTypes[] = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'type',
    align: 'left',
    label: 'Type',
    field: 'type',
  },
  {
    name: 'notificationAccount',
    align: 'left',
    label: 'Notification account',
    field: (row: any) => row.options.user,
  },
  {
    name: 'enable',
    align: 'left',
    label: 'Status',
    field: 'enable',
  },
  {
    name: 'actions',
    align: 'right',
    label: 'Actions',
    field: 'actions',
  },
];

function editNotification(notificationId: string): void {
  const notificationDataToEdit = notificationPageStore.readNotification(notificationId);

  if (isEmpty(notificationDataToEdit)) return;

  const {
    _id,
    enable,
    name,
    options,
    type,
  } = notificationDataToEdit;

  notificationPageStore.newNotification = {
    _id,
    enable,
    name,
    options,
    type,
  };
  notificationPageStore.setEditingNotification(true);
}

function removeNotification(notificationId: string): void {
  const dialogProps = {
    title: 'Confirm',
    message: 'Would you like to delete this notification?',
    cancel: true,
    persistent: true,
  };

  $q.dialog(dialogProps)
    .onOk(async () => {
      await notificationPageStore.deleteNotification(notificationId);
    })
    .onCancel(() => {
      // nothing here
    });
}
</script>

<style lang="scss">
$header-height: 50px;
$padding-y: 32px;
$title-height: 50px + 48px; // 48px margin bottom

$used-area: $header-height + $padding-y + ($title-height * 2);

.notification-card-content {
  padding: 8px;
  border: 1px solid rgba($secondary, .3);
  border-radius: 4px;
}

.q-table__card {
  box-shadow: none;
  border: 1px solid rgba($secondary, .3);
}

.notification-no-data {
  height: calc(100vh - #{$used-area})!important;
}
</style>
