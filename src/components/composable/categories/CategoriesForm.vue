<template>
  <div class="row full-width q-pa-md">
    <q-form
      greedy
      class="row full-width q-mt-md"
      ref="refAddCategoryForm">

      <div class="row col-12 q-mb-md">
        <q-input
          v-model="formData.name"
          v-bind="fieldDefaultProps"
          class="col"
          label="Category name"
          :rules="defaultRule"/>
      </div>

      <div class="row col-12 q-mb-md">
        <q-select
          v-model="formData.level"
          v-bind="fieldDefaultProps"
          emit-value
          map-options
          class="col"
          label="Level"
          :options="LEVEL_OPTIONS"
          :rules="defaultRule">
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
        </q-select>
      </div>

      <div class="row col-12 q-mb-md">
        <q-select
          v-model="formData.logTypeId"
          v-bind="fieldDefaultProps"
          emit-value
          map-options
          class="col"
          label="Search scheme"
          :options="searchSchemeOptions"
          :rules="defaultRule"/>
      </div>

      <NotificationsFields
        v-model:notifications="formData.notifications"
        :field-props="fieldDefaultProps"
        :notificationOptions="notificationOptions"/>

      <q-separator class="full-width q-mt-lg"/>

      <div class="row col-12 q-mt-lg">
        <q-btn
          no-caps
          unelevated
          color="primary"
          class="col-shrink"
          label="Save"
          @click="saveCategory"/>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CategoriesForm',
};
</script>

<script setup lang="ts">
/**
 * Impor LIBS / Components / Contants / etc..
 */
import {
  onMounted,
  ref,
  reactive,
  computed,
} from 'vue';

import { useQuasar } from 'quasar';
import { services } from 'src/services';
import { LEVEL_OPTIONS } from 'src/shared/constants';
import NotificationsFields from 'components/composable/categories/NotificationsFields.vue';

/**
 * STATE AND CONSTANTS
 * @type {QVueGlobals}
 */
const $q = useQuasar();
const fieldDefaultProps = {
  outlined: true,
  dense: true,
  'bg-color': 'white',
  'no-error-icon': true,
  'hide-bottom-space': true,
};

const refAddCategoryForm = ref(null);
const notificationOptions = ref([]);
const searchSchemeOptions = ref([]);

/**
 * Define props
 */
const props = defineProps({
  saveFormData: {
    type: Function,
    required: true,
  },
  formData: {
    type: Object,
    default: () => reactive({}),
  },
});

/**
 * Define emit
 */
const emit = defineEmits(['update:formData']);

/**
 * Computed data
 */
const formData = computed({
  get: () => props.formData,
  set: (formData) => emit('update:formData', formData),
});

const defaultRule = computed(() => ([
  (value: any) => !!(value && (value !== null)) || 'Field is required',
]));

onMounted(async () => {
  const findSearchSchemes = services.searchSchemas.find({ page: 1, perPage: 500 });
  const findNotifications = services.notifications.find({ page: 1, perPage: 500 });

  const [
    retDataSearchSchemes,
    retDataNotifications,
  ] = await Promise.all([findSearchSchemes, findNotifications]);

  const { items: searchSchemeList = [] } = retDataSearchSchemes;
  const { items: notificationList = [] } = retDataNotifications;

  searchSchemeOptions.value = searchSchemeList.map((el) => (
    { label: el.name, value: el._id }
  ));

  notificationOptions.value = notificationList.map((el) => (
    { label: el.name, value: el._id, type: el.type }
  ));
});

/**
 * Save new category
 * @returns {Promise<void>}
 */
async function saveCategory() {
  const result = await refAddCategoryForm.value?.validate();

  if (!result) {
    $q.notify({
      type: 'negative',
      message: 'All fields must be valid to continue!',
      timeout: 5000,
    });
    return;
  }

  await props.saveFormData();
  await refAddCategoryForm.value?.resetValidation();
}
</script>

<style lang="scss">
</style>
