<template>
  <q-page class="notifications-page full-height">
    <!-- MENU TO ADD / EDIT FORM -->
    <Drawer
      v-model:formData="formData"
      v-model:openDrawer="openDrawer"
      :drawerMode="drawerMode"
      :saveFormData="saveFormData"/>

    <!-- HEADER PAGE -->
    <HeaderPage
      :addNotification="addNotification"
      :notificationData="notificationsData"/>

    <div class="row full-width full-height">
      <template v-if="notificationsData.length">
        <!-- SEARCH RESULT -->
        <SearchResult
          v-if="notificationsData.length"
          :pagination="pagination"
          :switchPage="switchPage"
          :editNotification="editNotification"
          :removeNotification="removeNotification"
          :notificationsData="notificationsData"/>
      </template>

      <!-- NO DATA -->
      <template v-else>
        <NoData
          :addNotification="addNotification"/>
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
/**
 * Impor LIBS / Components / Contants / etc..
 */
import {
  ref,
  nextTick,
  onMounted,
  reactive,
  toRaw,
} from 'vue';

import { useQuasar } from 'quasar';
import { services } from 'src/services';

import NoData from './components/NoData.vue';
import HeaderPage from './components/Header.vue';
import SearchResult from './components/SearchResult.vue';
import Drawer from './components/Drawer.vue';

import { DEFAULT_STATE } from './constants';

// ------- //
// STATE'S //
// ------- //
const $q = useQuasar();

const notificationsData = ref<any>([]);
const formData = reactive({ ...DEFAULT_STATE });
const drawerMode = ref<string>('add');
const openDrawer = ref<boolean>(false);
const pagination = ref({
  page: 1,
  perPage: 10,
  total: 1,
});

onMounted(async () => {
  await getNotifications();
});

/**
 * Switch pagination
 * @param page
 */
async function switchPage(page: number) {
  pagination.value.page = page;
  await getNotifications();
}

/**
 * Get notifications
 * @param currentPage: number - Current page
 */
async function getNotifications() {
  const {
    items: notifications,
    pagination: paginationIfo,
  } = await services.notifications.find(pagination.value);

  notificationsData.value = notifications;
  pagination.value.total = paginationIfo.total;
}

/**
 * Click to save form data
 */
async function saveFormData() {
  if (drawerMode.value === 'add') {
    const notification = await services.notifications.create(toRaw(formData));
    notificationsData.value.push(notification);
  } else {
    const { _id: notificationId } = formData;
    const notification = await services.notifications.updateById(notificationId, toRaw(formData));
    const notificationIndex = getIndexById(notificationId);
    notificationsData.value[notificationIndex] = notification;
  }

  // Clean form
  Object.assign(formData, DEFAULT_STATE);
  openDrawer.value = false;
}

/**
 * update notification by id
 * @param notificationId: string - Notification id
 */
function addNotification(): void {
  drawerMode.value = 'add';
  openDrawer.value = true;
}

/**
 * update notification by id
 * @param notificationId: string - Notification id
 */
function editNotification(notificationId: string): void {
  const notification = getNotificationById(notificationId);

  Object.assign(formData, notification);
  drawerMode.value = 'edit';
  openDrawer.value = true;
}

/**
 * Remove notification by id
 * @param notificationId: string - Notification id
 */
function removeNotification(notificationId: string): void {
  const dialogProps = {
    title: 'Confirm',
    message: 'Would you like to delete this notification?',
    cancel: true,
    persistent: true,
  };

  $q.dialog(dialogProps)
    .onOk(async () => {
      await services.notifications.deleteById(notificationId);
      const notificationIndex = getIndexById(notificationId);
      notificationsData.value.splice(notificationIndex, 1);
    })
    .onCancel(() => {
      // nothing here
    });
}

/**
 * Get notification by id
 * @param notificationId: string - Notification id
 */
function getNotificationById(notificationId: string) {
  return notificationsData
    .value
    .find((item: any) => item._id === notificationId);
}

/**
 * Get notification by id
 * @param notificationId: string - Notification id
 */
function getIndexById(notificationId: string) {
  return notificationsData
    .value
    .findIndex((item: any) => item._id === notificationId);
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
  height: calc(100vh - #{$used-area}) !important;
}
</style>
