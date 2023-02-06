<template>
  <div class="full-width row q-col-gutter-y-md">
    <div
      v-for="(repeatableField, index) of repeatableFields"
      class="logtype-card row full-width q-my-md"
      :key="`logTypeTransform-${index}`">
      <div class="logtype-fields row col-12 q-col-gutter-y-md">
        <div class="row col-12 justify-between items-center">
          <span class="col-grow text-weight-bold">
            Field {{ index + 1 }}
          </span>

          <div
            v-if="repeatableFields.length > 1"
            class="row col-shrink">
            <q-btn
              dense
              no-caps
              unelevated
              round
              color="red-5"
              class="content-start"
              icon="delete"
              @click="removeLogTypeField(index)" />
          </div>
        </div>

        <div class="col-12 row">
          <q-input
            v-model="repeatableField.from"
            v-bind="props.fieldProps"
            class="col-9 q-pr-xs"
            label="Field from"
            :rules="defaultRule">
          </q-input>

          <q-select
            v-model="repeatableField.fromType"
            v-bind="props.fieldProps"
            class="col-3 q-pl-xs"
            label="Type"
            :options="fromTypes"
            :rules="defaultRule" />
        </div>

        <div class="col-12 row">
          <q-input
            v-model="repeatableField.to"
            v-bind="props.fieldProps"
            class="col"
            :rules="defaultRule"
            label="Field to" />
        </div>

        <div class="col-12 row">
          <q-select
            v-model="repeatableField.type"
            v-bind="props.fieldProps"
            class="col"
            label="Value type"
            :rules="defaultRule"
            :options="typesFromLogType" />
        </div>
      </div>
    </div>

    <div class="row col-12">
      <q-btn
        no-caps
        flat
        unelevated
        color="primary"
        class="col-shrink secondary-btn"
        icon="add"
        label="New field"
        @click="addLogTypeField" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogTypeFields',
};
</script>

<script setup>
import { onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';

import useLogTypePageStore from 'src/stores/pages/logTypesPage';

const $q = useQuasar();
const logTypePageStore = useLogTypePageStore();

const props = defineProps({
  fieldProps: {
    type: Object,
    default: () => {},
  },
});

const typesFromLogType = [
  { label: 'String', value: 'stringsBucket' },
  { label: 'Number', value: 'numbersBucket' },
  { label: 'Boolean', value: 'booleansBucket' },
  // { label: 'Date', value: 'dateBucket' },
  // { label: 'GeoPoints', value: 'geopointsBucket' },
];

const fromTypes = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
];

const repeatableFields = computed(() => logTypePageStore.newLogType.fields);

const defaultRule = computed(() => ([
  (value) => !!value || 'Field is required',
]));

onMounted(() => {
  addLogTypeField();
});

function addLogTypeField() {
  logTypePageStore.newLogType.fields.push({
    from: '',
    to: '',
    type: null,
    fromType: '',
  });
}

function removeLogTypeField(index) {
  const dialogProps = {
    title: 'Confirm',
    message: 'Would you like to delete this logType?',
    cancel: true,
    persistent: true,
  };

  $q.dialog(dialogProps)
    .onOk(async () => {
      const repeatableUpdated = logTypePageStore.newLogType.fields
        .filter((field, fieldIndex) => fieldIndex !== index);

      logTypePageStore.newLogType.fields = [...repeatableUpdated];
    })
    .onCancel(() => {
      // nothing here
    });
}
</script>

<style lang="scss">
.logtype-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
}
</style>
