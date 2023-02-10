<template>
  <div class="row col-12 justify-center items-center category-no-data">
    <div class="col-12 text-center">
      <EmptyCategory/>
      <p class="q-mt-md text-weight-bold">
        Wait! You don't have categories yet! Try to add new categories.
      </p>
      <q-btn
        dense
        no-caps
        unelevated
        class="col-shrink btn-primary bg-primary text-weight-bold text-white"
        icon="add"
        label="New category"
        padding="xs sm"
        @click="props.addCategory"/>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'NoData',
};
</script>

<script setup lang="ts">
import EmptyCategory from 'components/general/imagesSvg/EmptyCategory.vue';

/**
 * Define emits
 */
const props = defineProps({
  addCategory: {
    type: Function,
  },
});
</script>
