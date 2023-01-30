<template>
  <q-page class="settings-page full-height">
    <div class="row full-width content-center items-center q-mb-xl">
      <p class="text-h3 col-grow q-mr-md q-mb-none">Settings</p>
    </div>

    <template v-if="false">
      [Put the settings content here]
    </template>

    <template v-else>
      <div class="row col-12 justify-center items-center settings-no-data">
        <div class="col-12 text-center">
          <img src="img/empty-settings.svg" width="450" height="350" alt="">
          <p class="text-weight-bold">
            Ops! This page is under construction!
          </p>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script lang="ts">
export default {
  name: 'SettingsPage',
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

.settings-no-data {
  height: calc(100vh - #{$used-area})!important;
}
</style>
