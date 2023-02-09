<template>
  <div class="row full-width full-height">
    <q-table
      hide-pagination
      class="col-12"
      row-key="_id"
      :columns="COLUMNS"
      :pagination="{ rowsPerPage: 10 }"
      :rows="props.logsData">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width/>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr
          :key="props.row._id"
          :props="props">
          <q-td auto-width>
            <q-btn
              dense
              round
              unelevated
              color="info"
              size="sm"
              :icon="props.expand ? 'remove' : 'add'"
              @click.stop="props.expand = !props.expand"/>
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            @click.stop="props.expand = !props.expand">
            <code v-if="col.name === 'event'">{{ getPartialFromEventValue(col.value) }}</code>
            <q-chip
              v-if="col.name === 'level'"
              :color="getLevelColorByName(col.value) || 'grey-4'">
              {{ col.value }}
            </q-chip>
            <span v-if="col.name === 'created'">
                  {{ formatDate(col.value, 'YYYY/MM/DD HH:mm:ss') }}
                </span>
            <span v-if="col.name === 'category'">
                  {{ col.value }}
                </span>
          </q-td>
        </q-tr>

        <q-tr
          auto-width
          :key="props.row._id"
          v-show="props.expand"
          :props="props">
          <q-td colspan="100%">
            <div class="text-left">
              <p class="text-h6">Event details</p>
              <pre class="language-javascript"><code>{{ props.row.event }}</code></pre>
            </div>
          </q-td>
        </q-tr>
      </template>

    </q-table>

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
import { useQuasar } from 'quasar';
import { formatDate } from 'src/shared/helpers';

import { LEVEL_OPTIONS } from 'src/shared/constants';
import { COLUMNS } from 'pages/logs/constants';
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
</script>
