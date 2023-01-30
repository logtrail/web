import { defineStore } from 'pinia';

import { computed } from 'vue';
import { useState } from './state';

export const useGetters = defineStore('logTypes.getters', () => {
  const state = useState();

  const isAddingLogType = computed((): boolean => {
    const { addingLogType = false } = state;
    return addingLogType;
  });

  const isEditingLogType = computed((): boolean => {
    const { editingLogType = false } = state;
    return editingLogType;
  });

  const allLogTypes = computed((): object[] => {
    const { logTypesList = [] } = state;

    return logTypesList;
  });

  return {
    isAddingLogType,
    isEditingLogType,
    allLogTypes,
  };
});
