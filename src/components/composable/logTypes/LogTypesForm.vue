<template>
  <div class="row full-width q-pa-md">
    <div class="row col-12 justify-between items-center q-mb-xl">
      <span class="text-h6 col-grow">{{ logTypeTitle }}</span>
      <div class="col-shrink">
        <q-btn
          dense
          flat
          no-caps
          round
          unelevated
          class="col"
          icon="close"
          @click="closeNewLogType()" />
      </div>
    </div>

    <q-form
      greedy
      class="row full-width q-mt-md"
      ref="addLogTypeForm">

      <div class="row col-12 q-mb-md">
        <q-input
          v-model="logTypePageStore.newLogType.name"
          v-bind="fieldDefaultProps"
          class="col"
          label="LogType name"
          :rules="defaultRule" />
      </div>

      <LogTypeFields
        :field-props="fieldDefaultProps"
        :rules="defaultRule" />

      <q-separator class="full-width q-mt-lg" />

      <div class="row col-12 q-mt-lg">
        <q-btn
          no-caps
          unelevated
          color="primary"
          class="col-shrink"
          label="Save"
          @click="saveLogType" />
      </div>
    </q-form>
  </div>
</template>

<script>
export default {
  name: 'LogTypesForm',
};
</script>

<script setup>
import {
  // defineAsyncComponent,
  ref,
  computed,
  onMounted,
} from 'vue';
import { useQuasar } from 'quasar';

import useLogTypePageStore from 'src/stores/pages/logTypesPage';

import LogTypeFields from 'components/composable/logTypes/LogTypeFields.vue';

const $q = useQuasar();
const logTypePageStore = useLogTypePageStore();

const fieldDefaultProps = {
  outlined: true,
  dense: true,
  'bg-color': 'white',
  'no-error-icon': true,
  'hide-bottom-space': true,
};

const currentSelection = ref('');
const addLogTypeForm = ref(null);

const logTypeTitle = computed(() => {
  const { addingLogType, editingLogType } = logTypePageStore;

  if (addingLogType) return 'New LogType';
  if (editingLogType) return 'Edit LogType';

  return '';
});

const defaultRule = computed(() => ([
  (value) => !!value || 'Field is required',
]));

onMounted(() => {
  const { type: currentValueSelected } = logTypePageStore.newLogType;
  currentSelection.value = currentValueSelected;
});

function closeNewLogType() {
  logTypePageStore.clearNewLogType();
  addLogTypeForm.value.reset();
}

async function addLogType() {
  const logTypeHasJustCreated = await logTypePageStore.createLogType();

  if (logTypeHasJustCreated) {
    $q.notify({
      type: 'positive',
      message: 'Done! Successfully to create logType',
      timeout: 5000,
    });

    addLogTypeForm.value.reset();
    return;
  }

  $q.notify({
    type: 'negative',
    message: 'Oops! Something wrong!',
    caption: 'Wait some seconds and try again!',
    timeout: 5000,
  });
}

async function editLogType() {
  const logTypeHasJustEdited = await logTypePageStore.updateLogType();

  if (logTypeHasJustEdited) {
    $q.notify({
      type: 'positive',
      message: 'Done! Successfully to update logType',
      timeout: 5000,
    });

    addLogTypeForm.value.reset();
    return;
  }

  $q.notify({
    type: 'negative',
    message: 'Oops! Something wrong!',
    caption: 'Wait some seconds and try again!',
    timeout: 5000,
  });
}

async function saveLogType() {
  const { addingLogType, editingLogType } = logTypePageStore;
  const { value: addLogTypeFormReference = {} } = addLogTypeForm;

  const result = await addLogTypeFormReference?.validate().then((success) => success);

  if (!result) {
    $q.notify({
      type: 'negative',
      message: 'All fields must be valid to continue!',
      timeout: 5000,
    });
    return;
  }

  if (addingLogType) await addLogType();
  if (editingLogType) await editLogType();
}
</script>

<style lang="scss">
</style>
