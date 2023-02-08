<template>
  <div class="row col-12 justify-center items-center logs-no-data">
    <div class="col-12 text-center">
      <EmptyDashboard />
      <p class="text-weight-bold">
        You don't have logs yet!
      </p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'BannerNoData',
};
</script>

<script setup lang="ts">
import EmptyDashboard from 'components/general/imagesSvg/EmptyDashboard.vue';
</script>
