<template>
  <q-page class="settings-page full-height">
    <div class="row full-width content-center items-center q-mb-xl">
      <p class="text-h3 col-grow q-mr-md q-mb-none">Settings</p>
    </div>

    <div
      class="row full-width settings-card">
      <template
        v-for="(settingData, index) in settingsToShow"
        :key="`settings-${index}`">
        <div class="row full-width settings-card-item">
          <div class="row col-12 col-md-4 settings-card-item-description">
            <div class="col-12">
              {{ settingData.label }}
            </div>
          </div>
          <div class="row col-12 col-md-8 settings-card-item-value">
            <div
              v-if="!settingData.canEdit"
              class="col-12"
              v-html="settingData.value"></div>
            <div
              v-else
              class="col-12">
              <LtInput
                v-if="settingData.props.component === 'input'"
                v-model="settingsValues[settingData.key]"
                v-bind="settingData.props"
                @update:model-value="(value: any) => updateFieldValue(settingData.key, value)" />
            </div>
          </div>
        </div>
      </template>
    </div>

    <div
      v-if="canSaveChanges"
      class="row full-width justify-end q-mt-md">
      <div class="row col-shrink">
        <q-btn
          dense
          no-caps
          unelevated
          class="col-shrink btn-primary bg-primary text-white"
          label="Save changes"
          padding="xs sm"
          @click="updateSettings()" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
export default {
  name: 'SettingsPage',
};
</script>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { services } from 'src/services';
import LtInput from 'components/general/input/LtInput.vue';

import { TRANSFORM_FIELDS } from './constants';

const settingsDatabase = ref<any>({});

const settingsToShow = computed(() => {
  const newFields = Object.keys(settingsDatabase.value).map((key: string) => {
    const { [key]: value } = settingsDatabase.value;
    const formattedField = TRANSFORM_FIELDS[key](value, settingsDatabase.value);

    return formattedField;
  });

  return newFields;
});

const canSaveChanges = computed(() => {
  const atLeastOneFieldIsAbleToEdit = settingsToShow.value.some((field: any) => field.canEdit);
  return atLeastOneFieldIsAbleToEdit;
});

const settingsValues = ref<object>({});

onMounted(async () => {
  settingsDatabase.value = await services.management.collectionStatus();
  settingsToShow.value.forEach((element: any) => {
    const { canEdit, key, value } = element;
    if (canEdit) updateFieldValue(key, value);
  });
});

function updateFieldValue(key: string, value: string | number) {
  settingsValues.value = {
    ...settingsValues.value,
    [key]: value,
  };
}

function updateSettings() {
  //
}

</script>

<style lang="scss">
$header-height: 50px;
$padding-y: 32px;
$title-height: 50px + 48px; // 48px margin bottom

$used-area: $header-height + $padding-y + ($title-height * 2);

.settings-card {
  border-radius: 4px;
  border: 1px solid $grey-4;
  // padding: 16px;

  &-item {
    >* {
      padding: 16px 8px;
    }

    &-description {
      border-right: 1px solid $grey-4;
      // > * {
      //   text-align: right;
      // }
    }
  }

  &-item:not(:last-child) {
    border-bottom: 1px solid $grey-4;
  }
}

.q-table__card {
  box-shadow: none;
  border: 1px solid rgba($secondary, .3);
}

.settings-no-data {
  height: calc(100vh - #{$used-area})!important;
}
</style>
