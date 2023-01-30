import { defineStore } from 'pinia';

import { computed } from 'vue';
import { useState } from './state';

export const useGetters = defineStore('categories.getters', () => {
  const state = useState();

  const isAddingCategory = computed((): boolean => {
    const { addingCategory = false } = state;
    return addingCategory;
  });

  const isEditingCategory = computed((): boolean => {
    const { editingCategory = false } = state;
    return editingCategory;
  });

  const allCategories = computed((): object[] => {
    const { categoriesList = [] } = state;

    return categoriesList;
  });

  return {
    isAddingCategory,
    isEditingCategory,
    allCategories,
  };
});
