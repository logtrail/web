<template>
  <q-table
    hide-pagination
    class="col-12"
    row-key="_id"
    :columns="COLUMNS"
    :rows="props.searchSchemesData">

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
          class="cursor-pointer"
          :key="col.name"
          :props="props"
          @click.stop="props.expand = !props.expand">
          <span v-if="col.name === 'name'">{{ col.value }}</span>
          <span v-if="col.name === 'fields'">{{ col.value }}</span>
          <span v-if="col.name === 'created'">
            {{ formatDate(col.value, 'YYYY/MM/DD HH:mm:ss') }}
          </span>
          <div
            v-if="col.name === 'actions'"
            class="row justify-end">
            <q-btn
              dense
              round
              unelevated
              class="q-mr-xs"
              color="blue"
              @click.stop="editSearchScheme(props.row._id)">
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
              @click.stop="removeSearchScheme(props.row._id)">
              <q-icon
                name="delete"
                color="white"
                size="18px"/>
            </q-btn>
          </div>
        </q-td>
      </q-tr>

      <q-tr
        :key="props.row._id"
        v-show="props.expand"
        :props="props">
        <q-td colspan="100%">
          <div class="text-left">
            <p class="text-h6">Search fields</p>
            <pre class="language-javascript"><code>{{ props.row.fields }}</code></pre>
          </div>
        </q-td>
      </q-tr>
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

import { COLUMNS } from '../contants';

/**
 * Define emits
 */
const props = defineProps({
  searchSchemesData: {
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
  editSearchScheme: {
    type: Function,
  },
  removeSearchScheme: {
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
