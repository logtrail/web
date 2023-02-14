<template>
  <q-drawer
    overlay
    elevated
    class="bg-grey-2 q-pt-md right-drawer"
    side="right"
    :model-value="props.openDrawer"
    :width="500">
    <q-scroll-area class="fit">
      <div class="row col-12 justify-between items-center q-mb-xl q-px-md">
        <span class="text-h6 col-grow">{{ notificationTitle }}</span>
        <div class="col-shrink">
          <q-btn
            dense
            flat
            no-caps
            round
            unelevated
            class="col"
            icon="close"
            @click="closeDrawer"/>
        </div>
      </div>

      <NotificationForm
        v-model:formData="formData"
        :mode="props.drawerMode"
        :saveFormData="props.saveFormData" />
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
import NotificationForm from 'components/composable/notifications/NotificationForm.vue';

/**
 * Define props
 */
const props = defineProps({
  openDrawer: {
    type: Boolean,
  },
  drawerMode: {
    type: String,
  },
  saveFormData: {
    type: Function,
  },
  formData: {
    type: Object,
  },
});

/**
 * Define emit values to send to parent
 */
const emit = defineEmits(['update:formData', 'update:openDrawer']);

/**
 * Computed
 */
const formData = computed({
  get: () => props.formData,
  set: (formData) => emit('update:formData', formData),
});

const notificationTitle = computed(() => (
  props.drawerMode === 'edit'
    ? 'Edit Notification'
    : 'Add Notification'
));

/**
 * Close drawer
 */
function closeDrawer() {
  emit('update:openDrawer', false);
}
</script>
