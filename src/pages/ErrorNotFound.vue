<template>
  <div class="fullscreen bg-secondary text-white text-center q-pa-md flex flex-center">
    <div>
      <NotFound />

      <div class="text-h2 text-primary">
        Oops. Nothing here...
      </div>

      <q-btn
        class="q-mt-xl"
        color="primary"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import NotFound from 'components/general/imagesSvg/NotFound.vue';
</script>
