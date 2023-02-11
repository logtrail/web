<template>
  <q-table
    hide-pagination
    class="col-12"
    row-key="name"
    :columns="COLUMNS"
    :rows="props.notificationsData">

    <template v-slot:body-cell-enable="props">
      <q-td :props="props">
        <q-chip
          :color="props.row.status ? 'green' : 'red-4'"
          text-color="white">
          {{ props.row.status ? 'Enabled' : 'Disabled' }}
        </q-chip>
      </q-td>
    </template>

    <template v-slot:body-cell-created="props">
      <q-td :props="props">
        {{ formatDate(props.row.created) }}
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
              size="18px"/>
          </q-btn>

          <q-btn
            dense
            round
            unelevated
            class="q-ml-xs"
            color="red-5"
            @click="removeNotification(props.row._id)">
            <q-icon
              name="delete"
              color="white"
              size="18px"/>
          </q-btn>
        </div>
      </q-td>
    </template>
  </q-table>

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
import { formatDate } from 'src/shared/helpers';

import { COLUMNS } from '../constants';

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
  },
  removeNotification: {
    type: Function,
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
</script>
