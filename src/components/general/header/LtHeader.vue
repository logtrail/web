<template>
  <q-header class="bg-dark q-px-md">
    <q-toolbar class="q-px-none">
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer" />

        <router-link to="/">
          <img
            alt=""
            class="q-ml-md"
            src="logo.png">
        </router-link>
      <q-space />

      <slot></slot>

      <slot name="right-menu">
        <q-btn
          dense
          round
          unelevated
          color="primary"
          icon="person" />
      </slot>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
export default {
  name: 'LtHeader',
};
</script>

<script setup lang="ts">

const emit = defineEmits(['toggle-left-drawer']);

function toggleLeftDrawer() {
  emit('toggle-left-drawer');
}

</script>

<style lang="scss">
</style>
