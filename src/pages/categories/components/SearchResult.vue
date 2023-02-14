<template>
  <div class="search-result-card row q-gutter-y-sm full-width">
    <div
      v-for="currentCategory of allCategories"
      class="search-result-card_item row col-12 justify-between cursor-pointer"
      :id="`category-${currentCategory._id}`"
      :key="`category-${currentCategory._id}`"
      @click.stop="expandLogItem(currentCategory._id)">
      <div class="row col-12 col-md-2 q-pr-xs content-start">
        <span class="col-12 field-title">Name</span>
        <div class="col-12">
          {{ currentCategory.name }}
        </div>
      </div>

      <div class="row col-12 col-sm-shrink q-px-xs content-start">
        <div class="col-12 field-title">
          Level
        </div>
        <q-chip
          :color="getLevelColorByName(currentCategory.level)"
          :ripple="false">
          {{ getLevelNameByName(currentCategory.level) }}
        </q-chip>
      </div>

      <div class="row col-12 col-sm-shrink q-px-xs content-start">
        <div class="col-12 field-title">
          Search scheme
        </div>
        {{ currentCategory.logTypeName }}
      </div>

      <div class="row col-12 col-sm-2 q-px-xs content-start">
        <div class="col-12 field-title">
          Notifications
        </div>
        {{ notificationsTotal(currentCategory.notifications) }}
      </div>

      <div
        class="row col-12 col-sm-2 q-pl-xs content-start"
        :class="$q.screen.lt.md ? '' : 'text-right'">
        <div class="col-12 field-title">
          Created at
        </div>
        <div class="col-12">
          {{ formatDate(currentCategory.created, 'YYYY/MM/DD HH:mm:ss') }}
        </div>
      </div>

      <div class="row col-12 col-md-2 q-pl-xs content-center">
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
            @click.stop="editCategory(currentCategory._id)">
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
            @click.stop="removeCategory(currentCategory._id)">
            <q-icon
              name="delete"
              color="white"
              size="18px"/>
          </q-btn>
        </div>
      </div>

      <div
        class="full-width row category-details"
        @click.stop="() => ''">
        <q-separator class="q-my-md full-width" />
        <div class="text-left col-12">
          <p class="text-h6">Notification details</p>
          <pre class="language-javascript"><code>{{ currentCategory.notifications }}</code></pre>
        </div>
      </div>

      <q-menu
        touch-position
        context-menu>
        <q-list style="min-width: 80px">
          <q-item
            v-close-popup
            clickable
            @click="expandLogItem(currentCategory._id)">
            <q-item-section avatar>
              <q-icon name="unfold_less" />
            </q-item-section>
            <q-item-section>Toggle event details</q-item-section>
          </q-item>

          <q-separator />

          <q-item
            v-close-popup
            clickable
            @click="copyDataToClipboard(currentCategory._id)">
            <q-item-section avatar>
              <q-icon name="content_copy" />
            </q-item-section>
            <q-item-section>Copy category Id</q-item-section>
          </q-item>

          <q-item
            v-close-popup
            clickable
            @click="copyNotificationDetailsAsJSON(currentCategory)">
            <q-item-section avatar>
              <q-icon name="copy_all" />
            </q-item-section>
            <q-item-section>Copy notification details as JSON</q-item-section>
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
/**
 * Impor LIBS / Components / Contants / etc..
 */
import { computed } from 'vue';
import { useQuasar, copyToClipboard } from 'quasar';
import { formatDate } from 'src/shared/helpers';
import { LEVEL_OPTIONS } from 'src/shared/constants';

import { CategoryData } from '../interfaces';

const $q = useQuasar();

/**
 * Define emits
 */
const props = defineProps({
  categoryData: {
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
  editCategory: {
    type: Function,
    default: () => () => '',
  },
  removeCategory: {
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

const allCategories = computed((): CategoryData[] => {
  const { categoryData } = props;

  return categoryData as CategoryData[];
});

/**
 * Count total the notifications
 * @param notifications: { notificationId: string, destination: string }[] -
 */
function notificationsTotal(notifications: any[]) {
  if (notifications) {
    const total = notifications.length;
    return `${total} notification${total === 1 ? '' : 's'}`;
  }

  return 'No associated notification';
}

/**
 * Get level by name
 * @param name: string - level name
 */
function getLevelNameByName(name: string) {
  const { label: currentLevelName } = LEVEL_OPTIONS
    .find((levelOption) => levelOption.value === name) || {};

  return currentLevelName;
}

/**
 * Get color by level
 * @param level: string - level name
 */
function getLevelColorByName(level: string) {
  const { color: currentLevelOptionColor } = LEVEL_OPTIONS
    .find((levelOption) => levelOption.value === level) || {};

  return currentLevelOptionColor;
}

/**
 * @description Toggle category details by id
 *
 * @param {string} categoryId
 */
function expandLogItem(categoryId: string) {
  const categoryReference = document.getElementById(`category-${categoryId}`) as HTMLElement;

  if (!categoryReference) return;

  const eventDetailsReference = categoryReference.querySelector('.category-details') as HTMLElement;

  if (!eventDetailsReference) return;

  categoryReference.classList.toggle('category-expanded');
  eventDetailsReference.classList.toggle('animated');

  const heightValue = eventDetailsReference?.classList.contains('animated') ? eventDetailsReference?.scrollHeight : 0;
  eventDetailsReference.style.height = `${heightValue}px`;
}

/**
 * @description Copy category details as JSON by category data
 *
 * @param {CategoryData} category
 */
function copyNotificationDetailsAsJSON(category: CategoryData) {
  const { notifications = [] } = category;
  const categoryInJSON = JSON.stringify(notifications, null, 2);

  copyDataToClipboard(categoryInJSON);
}

/**
 * @description Copy data to clipboard
 *
 * @param {string} data
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
</script>

<style lang="scss" scoped>
.category-details {
  cursor: default;
  height: 0;
  overflow: hidden;
}

.category-expanded > .category-details {
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
