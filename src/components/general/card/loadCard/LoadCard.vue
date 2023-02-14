<template>
  <div
    v-for="index of numberOfCards"
    class="loading-card row q-col-gutter-x-sm"
    :key="`loading-${index}`">
    <div
      v-for="field in fields"
      class="col-12 row"
      :class="`col-md-${12 / fields.length}`"
      :key="`card-${field}`">
      <div
        class="col-12 row q-mb-xs"
        :class="field === (fields.length - 1) ? 'justify-end' : ''">
        <q-skeleton class="col-3" height="15px" />
      </div>
      <div
        class="col-12 row"
        :class="field === (fields.length - 1) ? 'justify-end' : ''">
        <q-skeleton class="col-5" height="35px" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'LoadCard' };
</script>

<script setup lang="ts">
const numberOfCards = Array.from({ length: 3 }, (value: any, key: number): number => key);
const fields = Array.from({ length: 4 }, (value: any, key: number): number => key);
</script>

<style lang="scss">
.loading-card {
  margin-bottom: 16px;
  width: 100%;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, .2);
}
</style>
