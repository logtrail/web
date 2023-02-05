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
              color="red"
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
            label="Field from">
          </q-input>

          <q-select
            v-model="repeatableField.fromType"
            v-bind="props.fieldProps"
            class="col-3 q-pl-xs"
            label="Type"
            :options="['String', 'Number', '...']" />
        </div>

        <div class="col-12 row">
          <q-input
            v-model="repeatableField.to"
            v-bind="props.fieldProps"
            class="col"
            label="Field to" />
        </div>

        <div class="col-12 row">
          <q-select
            v-model="repeatableField.type"
            v-bind="props.fieldProps"
            class="col"
            label="Value type"
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
import { ref } from 'vue';
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
  { label: 'Number', value: 'numberBucket' },
  { label: 'Boolean', value: 'booleanBucket' },
  { label: 'Date', value: 'dateBucket' },
  // { label: 'GeoPoints', value: 'geopointsBucket' },
];

const transformationTypes = [
  { label: '', value: '' },
];

const repeatableFields = ref([
  {
    from: '',
    to: '',
    type: null,
    fromType: '',
  },
]);

function addLogTypeField() {
  repeatableFields.value.push({
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
      const repeatableUpdated = repeatableFields.value
        .filter((field, fieldIndex) => fieldIndex !== index);

      repeatableFields.value = [...repeatableUpdated];
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
