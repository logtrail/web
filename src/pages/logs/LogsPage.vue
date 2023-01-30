<template>
  <q-page class="logs-page full-height">
    <div class="row full-width content-center items-center q-mb-xl">
      <p class="text-h3 col-grow q-mr-md q-mb-none">Logs</p>
    </div>

    <template v-if="false">
      [Put the logs content here]
    </template>

    <template v-else>
      <div class="row col-12 justify-center items-center logs-no-data">
        <div class="col-12 text-center">
          <img src="img/empty-dash.svg" width="450" height="350" alt="">
          <p class="text-weight-bold">
            You don't have logs yet!
          </p>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script lang="ts">
export default {
  name: 'LogsPage',
};
</script>

<script setup lang="ts">
</script>

<style lang="scss">
$header-height: 50px;
$padding-y: 32px;
$title-height: 50px + 48px; // 48px margin bottom

$used-area: $header-height + $padding-y + ($title-height * 2);

.q-table__card {
  box-shadow: none;
  border: 1px solid rgba($secondary, .3);
}

.logs-no-data {
  height: calc(100vh - #{$used-area})!important;
}
</style>
