<template>
  <div class="row full-width full-height">
    <div class="search-result-card row q-gutter-y-sm full-width">
      <div
        v-for="currentLog of props.logsData"
        class="search-result-card_item row col-12 justify-between"
        :id="`log-${currentLog._id}`"
        :key="`log-${currentLog._id}`">
        <div
          class="row col-12 col-md-5 q-pr-xs content-start cursor-pointer"
          @click.stop="expandLogItem(currentLog._id)">
          <span class="col-12 field-title">Event</span>
          <code>{{ getPartialFromEventValue(currentLog.event) }}</code>
        </div>

        <div class="row col-12 col-sm-2 q-px-xs content-start">
          <div class="col-12 field-title">
            Level
          </div>
          <q-chip
            :color="getLevelColorByName(currentLog.level) || 'grey-4'"
            :ripple="false">
            {{ currentLog.level }}
          </q-chip>
        </div>

        <div class="row col-12 col-sm-2 q-px-xs content-start">
          <div class="col-12 field-title">
            Category
          </div>
          {{ currentLog.category }}
        </div>

        <div
          class="row col-12 col-sm-3 q-pl-xs content-start"
          :class="$q.screen.lt.md ? '' : 'text-right'">
          <div class="col-12 field-title">
            Created at
          </div>
          <div class="col-12">
            {{ formatDate(currentLog.created, 'YYYY/MM/DD HH:mm:ss') }}
          </div>
        </div>

        <div class="full-width row log-details">
          <q-separator class="q-my-md full-width" />
          <div class="text-left col-12">
            <p class="text-h6">Event details</p>
            <pre class="language-javascript"><code>{{ currentLog.event }}</code></pre>
          </div>
        </div>

        <q-menu
          touch-position
          context-menu>
          <q-list style="min-width: 80px">
            <q-item
              v-close-popup
              clickable
              @click="expandLogItem(currentLog._id)">
              <q-item-section avatar>
                <q-icon name="unfold_less" />
              </q-item-section>
              <q-item-section>Toggle event details</q-item-section>
            </q-item>

            <q-item
              v-close-popup
              clickable
              @click="openEventDetailsInNewPage(currentLog._id)">
              <q-item-section avatar>
                <q-icon name="open_in_new" />
              </q-item-section>
              <q-item-section>Open details in new tab</q-item-section>
            </q-item>

            <q-separator />

            <q-item
              v-close-popup
              clickable
              @click="copyEventDetailsAsJSON(currentLog)">
              <q-item-section avatar>
                <q-icon name="content_copy" />
              </q-item-section>
              <q-item-section>Copy event details as JSON</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </div>

    <div class="row col-12 justify-center items-center q-col-gutter-sm q-mt-md">
      <div class="row col-shrink">
        <q-btn
          flat
          no-caps
          unelevated
          color="primary"
          class="col secondary-btn"
          icon="arrow_back"
          label="Previous"
          :disable="!props.enablePreviousPage"
          @click.stop="props.previousPage"/>
      </div>

      <div class="row col-shrink">
        <q-btn
          no-caps
          unelevated
          color="primary"
          class="col"
          icon-right="arrow_forward"
          label="Next"
          :disable="!props.enableNextPage"
          @click.stop="props.nextPage"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'SearchResult' };
</script>

<script setup lang="ts">
import { useQuasar, copyToClipboard } from 'quasar';
import { useRouter } from 'vue-router';

import { formatDate } from 'src/shared/helpers';

import { LEVEL_OPTIONS } from 'src/shared/constants';
import { COLUMNS } from 'pages/logs/constants';
import { LogData } from '../interfaces';

/**
 * Props to use
 */
const props = defineProps({
  logsData: {
    type: Array,
  },
  nextPage: {
    type: Function,
  },
  previousPage: {
    type: Function,
  },
  enablePreviousPage: {
    type: Boolean,
  },
  enableNextPage: {
    type: Boolean,
  },
});

// ------//
// STATE //
// ------//
const $q = useQuasar();
const $router = useRouter();

// ------- //
// METHODS //
// ------- //
/**
 * Get color by level
 * @param level: string - Level name
 */
function getLevelColorByName(level: string) {
  const { color: currentLevelOptionColor } = LEVEL_OPTIONS
    .find((levelOption) => levelOption.value === level) || {};

  return currentLevelOptionColor;
}

function getPartialFromEventValue(value: string) {
  let maxSize = 80;

  if ($q.screen.lt.sm) maxSize = 35;
  if ($q.screen.lt.md) maxSize = 45;
  if ($q.screen.lt.lg) maxSize = 55;

  const newText = JSON.stringify(value).substring(0, maxSize);
  return `${newText}...`;
}

function expandLogItem(logId: string) {
  const logReference = document.getElementById(`log-${logId}`);

  if (!logReference) return;

  const eventDetailsReference = logReference.querySelector('.log-details');

  if (!eventDetailsReference) return;

  logReference.classList.toggle('log-expanded');

  eventDetailsReference.classList.toggle('animated');
  eventDetailsReference.classList.toggle('shakeY');

  const heightValue = eventDetailsReference?.classList.contains('animated') ? eventDetailsReference?.scrollHeight : 0;
  eventDetailsReference.style.height = `${heightValue}px`;
}

function openEventDetailsInNewPage(eventId: string) {
  const path = `/log-details/${eventId}`;
  const routeData = $router.resolve({ path });
  window.open(routeData.href, '_blank');
}

function copyEventDetailsAsJSON(event: LogData) {
  const eventInJSON = JSON.stringify(event, null, 2);

  copyToClipboard(eventInJSON)
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
.search-result-card {

  &_item {
    padding: 16px;
    border-radius: 4px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, .2);
  }
}

.log-details {
  height: 0;
  overflow: hidden;
}

.log-expanded > .log-details {
  overflow: visible;
}

.q-table__card {
  box-shadow: none;
  border: 1px solid rgba($secondary, .3);
}

.field {
  &-title {
    margin-bottom: 4px;
    color: $grey-7;
  }
}

.q-chip {
  margin: 0;
  font-size: 12px;
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
