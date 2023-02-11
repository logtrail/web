<template>
  <div class="row col-12 justify-center items-center notification-no-data">
    <div class="col-12 text-center">
      <EmptyNotification/>
      <p class="q-mt-md text-weight-bold">
        Wait! You don't have notifications accounts yet! Try to add new notification accounts.
      </p>
      <q-btn
        dense
        no-caps
        unelevated
        class="col-shrink btn-primary bg-primary text-weight-bold text-white"
        icon="add"
        label="New notification"
        padding="xs sm"
        @click="props.addNotification"/>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'NoData',
};
</script>

<script setup lang="ts">
import EmptyNotification from 'components/general/imagesSvg/EmptyNotification.vue';

/**
 * Define props
 */
const props = defineProps({
  addNotification: {
    type: Function,
  },
});
</script>
