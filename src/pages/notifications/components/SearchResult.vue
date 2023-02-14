<template>
  <div class="search-result-card row full-width">
    <div
      v-for="currentNotification of allNotifications"
      class="search-result-card_item row col-12 justify-between cursor-pointer"
      :class="$q.screen.lt.md ? 'q-col-gutter-y-md' : ''"
      :id="`notification-${currentNotification._id}`"
      :key="`notification-${currentNotification._id}`"
      @click.stop="expandNotificationItem(currentNotification._id)">
      <div class="row col-12 col-md-2 q-pr-xs content-start">
        <span class="col-12 field-title">Name</span>
        <span class="col-12">
          {{ currentNotification.name }}
        </span>
      </div>

      <div class="row col-12 col-md-1 q-px-xs content-start">
        <span class="col-12 field-title">
          Type
        </span>
        <span class="col-12">
          {{ currentNotification.type }}
        </span>
      </div>

      <div class="row col-12 col-md-4 q-pl-xs content-start">
        <span class="col-12 field-title">
          User
        </span>
        <span class="col-12">
          {{ currentNotification.options.user }}
        </span>
      </div>

      <div class="row col-12 col-md-1 q-px-xs content-start">
        <span class="col-12 field-title">
          Status
        </span>
        <q-chip
          dense
          text-color="white"
          :color="currentNotification.enable ? 'green' : 'red-4'">
          <small>
            {{ currentNotification.enable ? 'Enabled' : 'Disabled' }}
          </small>
        </q-chip>
      </div>

      <div
        class="row col-12 col-md-2 q-pl-xs content-start"
        :class="$q.screen.lt.md ? '' : 'text-right'">
        <span class="col-12 field-title">
          Created at
        </span>
        <span class="col-12">
          {{ formatDate(currentNotification.created, 'YYYY/MM/DD HH:mm:ss') }}
        </span>
      </div>

      <div class="row col-12 col-md-1 q-pl-xs content-center">
        <!-- <span class="col-12 field-title">
          Actions
        </span> -->
        <div
          class="col-12 row"
          :class="$q.screen.lt.md ? '' : 'justify-end'">
          <q-btn
            dense
            round
            unelevated
            class="q-mr-xs"
            color="blue"
            @click.stop="editNotification(currentNotification._id)">
            <q-icon
              name="edit"
              color="white"
              size="18px"/>
          </q-btn>

          <q-btn
            dense
            round
            unelevated
            class="q-ml-xs"
            color="red-5"
            @click.stop="removeNotification(currentNotification._id)">
            <q-icon
              name="delete"
              color="white"
              size="18px"/>
          </q-btn>
        </div>
      </div>

      <div
        class="full-width row notification-details"
        @click.stop="() => ''">
        <q-separator class="q-my-md full-width" />
        <div class="text-left col-12">
          <p class="text-h6">Account details</p>
          <!-- eslint-disable-next-line max-len -->
          <pre class="language-javascript"><code>{{ accountDetails(currentNotification) }}</code></pre>
        </div>
      </div>

      <q-menu
        touch-position
        context-menu>
        <q-list style="min-width: 80px">
          <q-item
            v-close-popup
            clickable
            @click="expandNotificationItem(currentNotification._id)">
            <q-item-section avatar>
              <q-icon name="unfold_less" />
            </q-item-section>
            <q-item-section>Toggle notification details</q-item-section>
          </q-item>

          <q-separator />

          <q-item
            v-close-popup
            clickable
            @click="copyDataToClipboard(currentNotification._id)">
            <q-item-section avatar>
              <q-icon name="content_copy" />
            </q-item-section>
            <q-item-section>Copy notification Id</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>
  </div>

  <div class="row justify-center q-mt-md full-width">
    <q-pagination
      v-model="currentPage"
      color="secondary"
      size="md"
      :max="props.pagination.total"/>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SearchResult',
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar, copyToClipboard } from 'quasar';
import { formatDate } from 'src/shared/helpers';

import { NotificationData } from '../interfaces';

const $q = useQuasar();

/**
 * Define emits
 */
const props = defineProps({
  notificationsData: {
    type: Array,
  },
  pagination: {
    type: Object,
    required: true,
  },
  switchPage: {
    type: Function,
    required: true,
  },
  editNotification: {
    type: Function,
    default: () => () => '',
  },
  removeNotification: {
    type: Function,
    default: () => () => '',
  },
});

/**
 * Computed current page
 */
const currentPage = computed({
  get() {
    return props.pagination.page;
  },
  set(page) {
    props.switchPage(page);
  },
});

const allNotifications = computed((): NotificationData[] => {
  const { notificationsData } = props;

  return notificationsData as NotificationData[];
});

/**
 * @description Toggle notification details by id
 *
 * @param {string} notificationId
 */
function expandNotificationItem(notificationId: string) {
  const notificationReference = document.getElementById(`notification-${notificationId}`) as HTMLElement;

  if (!notificationReference) return;

  const notificationDetailsReference = notificationReference.querySelector('.notification-details') as HTMLElement;

  if (!notificationDetailsReference) return;

  notificationReference.classList.toggle('notification-expanded');
  notificationDetailsReference.classList.toggle('animated');

  const heightValue = notificationDetailsReference?.classList.contains('animated') ? notificationDetailsReference?.scrollHeight : 0;
  notificationDetailsReference.style.height = `${heightValue}px`;
}

/**
 * @description Copy data to clipboard
 *
 * @param {string} data: data to copy to clipboard
 */
function copyDataToClipboard(data: string) {
  copyToClipboard(data)
    .then(() => {
      $q.notify({
        type: 'positive',
        message: 'Copied to transfer area!',
        timeout: 5000,
      });
    })
    .catch(() => {
      $q.notify({
        type: 'negative',
        message: 'Oops! Fail to copy event details!',
        timeout: 5000,
      });
    });
}

/**
 * @description Get account details
 *
 * @param {NotificationData} notification: Notification account data
 */
function accountDetails(notification: NotificationData) {
  const { options } = notification;
  const { _id, ...notificationDetails } = options;

  return {
    ...notificationDetails,
    useTLS: notificationDetails.useTLS ? 'Yes' : 'No',
    user: notificationDetails.user,
    password: '*******',
  };
}
</script>

<style lang="scss" scoped>
.search-result-card_item {
  @media screen and (max-width: 1023px) {
    margin-bottom: 32px;
  }

  @media screen and (min-width: 1024px) {
    margin-bottom: 16px;
  }
}

.notification-details {
  cursor: default;
  height: 0;
  overflow: hidden;
}

.notification-expanded > .notification-details {
  overflow: visible;
}

code {
  background: $grey-2;
  color: $dark;
  word-wrap: break-word;
  box-decoration-break: clone;
  padding: .1rem .3rem .2rem;
  border-radius: .2rem;
  font-family: monospace;
  max-width: 100%;
}
</style>
