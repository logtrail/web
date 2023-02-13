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

<style lang="scss" scoped>
$header-height: 50px;
$padding-y: 32px;
$title-height: 50px + 48px; // 48px margin bottom
$filters-height: 132px;

$used-area: $header-height + $padding-y + ($title-height * 2) + $filters-height;

.logs-no-data {
  height: calc(100vh - #{$used-area}) !important;
}
</style>
