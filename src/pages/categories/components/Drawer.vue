<template>
  <q-drawer
    overlay
    elevated
    class="bg-grey-2 q-pt-md right-drawer"
    side="right"
    :model-value="props.openDrawer"
    :width="500">
    <q-scroll-area class="fit">
      <div class="row col-12 justify-between items-center q-mb-xl">
        <span class="text-h6 col-grow">{{ categoryTitle }}</span>
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

      <CategoriesForm
        v-model:formData="formData"
        :saveFormData="props.saveFormData"/>
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
import CategoriesForm from 'components/composable/categories/CategoriesForm.vue';

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

const categoryTitle = computed(() => (
  props.drawerMode === 'edit'
    ? 'Edit Category'
    : 'Add Category'
));

/**
 * Close drawer
 */
function closeDrawer() {
  emit('update:openDrawer', false);
}
</script>
