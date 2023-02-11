<template>
  <div class="row col-12 justify-center items-center logType-no-data">
    <div class="col-12 text-center">
      <EmptySearchScheme/>
      <p class="q-mt-md text-weight-bold">
        Wait! You don't have search secheme yet! Try to add new search scheme.
      </p>
      <q-btn
        dense
        no-caps
        unelevated
        class="col-shrink btn-primary bg-primary text-weight-bold text-white"
        icon="add"
        label="New search scheme"
        padding="xs sm"
        @click="addSearchScheme"/>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'NoData',
};
</script>

<script setup lang="ts">
import EmptySearchScheme from 'components/general/imagesSvg/EmptySearchScheme.vue';

/**
 * Define props
 */
const props = defineProps({
  addSearchScheme: {
    type: Function,
  },
});
</script>
