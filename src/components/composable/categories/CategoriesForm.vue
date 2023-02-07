<template>
  <div class="row full-width q-pa-md">
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
          @click="closeNewCategory()" />
      </div>
    </div>

    <q-form
      greedy
      class="row full-width q-mt-md"
      ref="addCategoryForm">

      <div class="row col-12 q-mb-md">
        <q-input
          v-model="categoriesPageStore.newCategory.name"
          v-bind="fieldDefaultProps"
          class="col"
          label="Category name"
          :rules="defaultRule" />
      </div>

      <div class="row col-12 q-mb-md">
        <q-select
          v-model="categoriesPageStore.newCategory.level"
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
          v-model="categoriesPageStore.newCategory.logType"
          v-bind="fieldDefaultProps"
          emit-value
          map-options
          class="col"
          label="Search scheme"
          :options="searchSchemeOptions"
          :rules="defaultRule" />
      </div>

      <NotificationsFields
        :field-props="fieldDefaultProps"
        :notificationOptions="notificationOptions" />

      <q-separator class="full-width q-mt-lg" />

      <div class="row col-12 q-mt-lg">
        <q-btn
          no-caps
          unelevated
          color="primary"
          class="col-shrink"
          label="Save"
          @click="saveCategory" />
      </div>
    </q-form>
  </div>
</template>

<script>
export default {
  name: 'CategoriesForm',
};
</script>

<script setup>
import {
  onMounted,
  ref,
  computed,
} from 'vue';

import { useQuasar } from 'quasar';
import { services } from 'src/services';
import useCategoryPageStore from 'src/stores/pages/categoriesPage';
import { LEVEL_OPTIONS } from 'src/shared/constants';
import NotificationsFields from 'components/composable/categories/NotificationsFields.vue';

const $q = useQuasar();
const categoriesPageStore = useCategoryPageStore();

const fieldDefaultProps = {
  outlined: true,
  dense: true,
  'bg-color': 'white',
  'no-error-icon': true,
  'hide-bottom-space': true,
};

const addCategoryForm = ref(null);
const notificationOptions = ref([]);
const searchSchemeOptions = ref([]);

const categoryTitle = computed(() => {
  const { addingCategory, editingCategory } = categoriesPageStore;

  if (addingCategory) return 'New Category';
  if (editingCategory) return 'Edit Category';

  return '';
});

const defaultRule = computed(() => ([
  (value) => !!value || 'Field is required',
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

function closeNewCategory() {
  categoriesPageStore.clearNewCategory();
  addCategoryForm.value.reset();
}

async function addCategory() {
  const categoryHasJustCreated = await categoriesPageStore.createCategory();

  if (categoryHasJustCreated) {
    $q.notify({
      type: 'positive',
      message: 'Done! Successfully to create category',
      timeout: 5000,
    });

    addCategoryForm.value.reset();
    return;
  }

  $q.notify({
    type: 'negative',
    message: 'Oops! Something wrong!',
    caption: 'Wait some seconds and try again!',
    timeout: 5000,
  });
}

async function editCategory() {
  const categoryHasJustEdited = await categoriesPageStore.updateCategory();

  if (categoryHasJustEdited) {
    $q.notify({
      type: 'positive',
      message: 'Done! Successfully to update categories',
      timeout: 5000,
    });

    addCategoryForm.value.reset();
    return;
  }

  $q.notify({
    type: 'negative',
    message: 'Oops! Something wrong!',
    caption: 'Wait some seconds and try again!',
    timeout: 5000,
  });
}

async function saveCategory() {
  const { addingCategory, editingCategory, newCategory } = categoriesPageStore;
  const { value: addCategoryFormReference = {} } = addCategoryForm;

  const result = await addCategoryFormReference?.validate().then((success) => success);

  if (!result) {
    $q.notify({
      type: 'negative',
      message: 'All fields must be valid to continue!',
      timeout: 5000,
    });
    return;
  }

  if (addingCategory) await addCategory();
  if (editingCategory) await editCategory();
}
</script>

<style lang="scss">
</style>
