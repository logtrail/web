<template>
  <div class="row full-width content-center items-center q-mb-xl">
    <p class="text-h3 col-shrink q-mr-md q-mb-none">Notifications</p>
    <q-btn
      v-if="props.notificationData.length"
      dense
      no-caps
      unelevated
      class="col-shrink btn-primary bg-primary text-white"
      icon="add"
      label="New notification"
      padding="xs sm"
      @click="props.addNotification"/>
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
  notificationData: {
    type: Array,
    default: () => [],
  },
  addNotification: {
    type: Function,
  },
});
</script>
