<template>
  <div class="row full-width content-center items-center q-mb-xl">
    <p class="text-h3 col-shrink q-mr-md q-mb-none">Categories</p>
    <q-btn
      v-if="categoryData.length"
      dense
      no-caps
      unelevated
      class="col-shrink btn-primary bg-primary text-white"
      icon="add"
      label="New category"
      padding="xs sm"
      @click="props.addCategory"/>
  </div>
</template>

<script lang="ts">
export default {
  name: 'HeaderPa ge',
};
</script>

<script setup lang="ts">

/**
 * Define emits
 */
const props = defineProps({
  addCategory: {
    type: Function,
  },
  categoryData: {
    type: Array,
  },
});
</script>
