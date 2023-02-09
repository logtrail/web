<template>
  <div class="row reverse full-width items-center q-col-gutter-sm">
    <div class="row col-12 col-md-shrink">
      <q-btn
        no-caps
        unelevated
        class="col"
        color="primary"
        label="Search"
        icon="search"
        @click.stop="props.getLogs"/>
    </div>

    <div class="row col-12 col-md-shrink">
      <q-btn
        flat
        no-caps
        unelevated
        color="primary"
        class="col secondary-btn"
        icon="filter_alt"
        @click.stop="openAdvancedFilters">
        <p class="q-mb-none q-mx-sm">
          Advanced Search
        </p>
        <q-chip
          v-if="props.advancedFilters.length"
          dense
          color="primary">
          {{ props.advancedFilters.length }}
        </q-chip>
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ActionsPage',
};
</script>

<script setup lang="ts">
/**
 * Props you can use
 */
const props = defineProps({
  advancedFilters: {
    type: Array,
  },
  getLogs: {
    type: Function,
  },
});

/**
 * Emit's to parent
 */
const emit = defineEmits(['update:statusModalAdvancedFilters']);

/**
 * Open advanced filters
 */
function openAdvancedFilters() {
  emit('update:statusModalAdvancedFilters', true);
}
</script>
