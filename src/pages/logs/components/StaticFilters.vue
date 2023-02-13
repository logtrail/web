<template>
  <div
    class="row full-width items-center q-mb-sm"
    :class="staticFilterGutterClasses">
    <div class="row col-12 col-md-6 col-lg-3">
      <LtInput
        readonly
        class="col"
        label="Start Date"
        :model-value="props.startDate">
        <template v-slot:prepend>
          <q-icon
            class="cursor-pointer"
            name="event">
            <q-popup-proxy
              cover
              transition-hide="scale"
              transition-show="scale">
              <q-date
                mask="YYYY-MM-DD HH:mm"
                :model-value="props.startDate"
                @update:model-value="(value) => emitValue(value, 'startDate')">
                <div class="row items-center justify-end">
                  <q-btn
                    v-close-popup
                    flat
                    color="primary"
                    label="Close"/>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon
            class="cursor-pointer"
            name="access_time">
            <q-popup-proxy
              cover
              transition-hide="scale"
              transition-show="scale">
              <q-time
                format24h
                mask="YYYY-MM-DD HH:mm"
                :model-value="props.startDate"
                @update:model-value="(value) => emitValue(value, 'startDate')">
                <div class="row items-center justify-end">
                  <q-btn
                    v-close-popup
                    flat
                    color="primary"
                    label="Close"/>
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </LtInput>
    </div>

    <div class="row col-12 col-md-6 col-lg-3">
      <LtInput
        readonly
        class="col"
        label="End Date"
        :model-value="props.endDate"
        @update:model-value="(value) => emitValue(value, 'endDate')">
        <template v-slot:prepend>
          <q-icon
            class="cursor-pointer"
            name="event">
            <q-popup-proxy
              cover
              transition-hide="scale"
              transition-show="scale">
              <q-date
                mask="YYYY-MM-DD HH:mm"
                :model-value="props.endDate"
                @update:model-value="(value) => emitValue(value, 'endDate')">
                <div class="row items-center justify-end">
                  <q-btn
                    v-close-popup
                    flat
                    color="primary"
                    label="Close"/>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon
            class="cursor-pointer"
            name="access_time">
            <q-popup-proxy
              cover
              transition-hide="scale"
              transition-show="scale">
              <q-time
                format24h
                mask="YYYY-MM-DD HH:mm"
                :model-value="props.endDate"
                @update:model-value="(value) => emitValue(value, 'endDate')">
                <div class="row items-center justify-end">
                  <q-btn
                    v-close-popup
                    flat
                    color="primary"
                    label="Close"/>
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </LtInput>
    </div>

    <div class="row col-12 col-md-6 col-lg-3">
      <q-select
        dense
        hide-bottom-space
        multiple
        no-error-icon
        outlined
        bg-color="white"
        class="col"
        label="Levels"
        :options="LEVEL_OPTIONS"
        :model-value="props.levels"
        @update:model-value="(value) => emitValue(value, 'levels')">
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>
                <q-chip :color="scope.opt.color || 'grey-4'">
                  {{ scope.opt.label }}
                </q-chip>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:selected>
          <div
            v-if="levels.length"
            class="row items-center">
            <q-chip
              dense
              :color="levels[0].color || 'grey-4'">
              {{ levels[0].label }}
            </q-chip>
            <q-chip
              v-if="levels.length > 1"
              dense>
              +{{ levels.length - 1 }}
            </q-chip>
          </div>
        </template>
      </q-select>
    </div>

    <div class="row col-12 col-md-6 col-lg-3">
      <LtSelect
        multiple
        class="col"
        label="Categories"
        :virtual-scroll-item-size="VIRTUAL_SCROLL_ITEM_SIZE"
        :popup-content-style="{
          'min-height': '100px;',
          'max-height': '150px;'
        }"
        :model-value="props.categories"
        :loading="searchMoreCategories"
        :options="categoriesOptions"
        @virtual-scroll="getCategoriesByNextPage"
        @update:model-value="(value) => emitValue(value, 'categories')">
        <template v-slot:selected>
          <div
            v-if="categories.length"
            class="row items-center">
            <q-chip dense>
              {{ categories[0].label }}
            </q-chip>

            <q-chip
              v-if="categories.length > 1"
              dense>
              +{{ categories.length - 1 }}
            </q-chip>
          </div>
        </template>
      </LtSelect>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'StaticFilters',
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';

import { LEVEL_OPTIONS, VIRTUAL_SCROLL_ITEM_SIZE } from 'src/shared/constants';

import LtInput from 'components/general/input/LtInput.vue';
import LtSelect from 'components/general/select/LtSelect.vue';

import { useCategories } from 'src/composables';

const $q = useQuasar();

const {
  getCategoriesByNextPage,
  categoriesOptions,
  searchMoreCategories,
} = useCategories();

// Define v-models and props
const props = defineProps({
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  levels: {
    type: Array,
  },
  categories: {
    type: Array,
  },
});

// Define v-models to update
const emit = defineEmits([
  'update:startDate',
  'update:endDate',
  'update:levels',
  'update:categories',
]);

const staticFilterGutterClasses = computed(() => {
  const { screen } = $q;

  if (screen.lt.md) return 'q-gutter-y-sm';
  if (screen.gt.sm) return 'q-col-gutter-sm';

  return 'q-gutter-sm';
});

/**
 * Emit to parent the value
 * @param value: string - Value to emit
 * @param fieldName: string - Field name
 */
function emitValue(value: any, fieldName: string) {
  const emitName = `update:${fieldName}` as keyof typeof emit;
  emit(emitName, value);
}

</script>
