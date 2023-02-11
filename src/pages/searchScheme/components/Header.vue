<template>
  <div class="row full-width content-center items-center q-mb-xl">
    <p class="text-h3 col-shrink q-mr-md q-mb-none">Search scheme</p>
    <q-btn
      v-if="props.searchSchemesData.length"
      dense
      no-caps
      unelevated
      class="col-shrink btn-primary bg-primary text-white"
      icon="add"
      label="New Search Scheme"
      padding="xs sm"
      @click="addSearchScheme"/>
  </div>
</template>

<script lang="ts">
export default {
  name: 'HeaderPage',
};
</script>

<script setup lang="ts">

/**
 * Define props
 */
const props = defineProps({
  searchSchemesData: {
    type: Array,
  },
  addSearchScheme: {
    type: Function,
  },
});
</script>
