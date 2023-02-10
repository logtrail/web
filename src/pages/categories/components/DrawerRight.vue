<template>
  <q-drawer
    v-model="openDrawer"
    overlay
    elevated
    class="bg-grey-2 q-pt-md right-drawer"
    side="right"
    :width="500">
    <q-scroll-area class="fit">
      <CategoriesForm/>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts">
export default {
  name: 'DrawerRight',
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
/**
 * Define props
 */
const props = defineProps({
  openDrawer: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:openDrawer'])

const openDrawer = computed({
  get() {
    return props.openDrawer;
  },
  set(state) {
    emit('update:openDrawer', state);
  },
});
</script>
