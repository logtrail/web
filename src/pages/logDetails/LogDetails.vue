<template>
  <q-page class="logs-page full-height">
    <div
      class="row full-width content-center items-center q-mb-xl"
      :class="$q.screen.lt.md ? 'q-col-gutter-y-sm' : 'q-col-gutter-sm'">
      <p class="text-h3 col-grow q-mr-md q-mb-none">Log Details</p>
    </div>
  </q-page>
</template>

<script lang="ts">
export default { name: 'LogDetails' };
</script>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
</style>
