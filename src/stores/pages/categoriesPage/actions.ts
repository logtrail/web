import { defineStore } from 'pinia';
import { uid } from 'quasar';

import { services } from 'src/services';

import { useState } from './state';
import Category from './types/category.type';

export const useActions = defineStore('categories.actions', () => {
  const state = useState();

  function setAddingCategory(isAdding: boolean): void {
    state.addingCategory = isAdding;
  }

  function setEditingCategory(isEditing: boolean): void {
    state.editingCategory = isEditing;
  }

  function clearNewCategory() {
    setAddingCategory(false);
    setEditingCategory(false);
    state.newCategory = {
      name: '',
      level: '',
      logTypeId: '',
      notifications: [],
    };
  }

  function setCategories(categoriesList: any[]) {
    state.categoriesList = categoriesList;
  }

  async function createCategory(): Promise<boolean> {
    const id = uid();
    const created = '';
    const modified = '';

    const { newCategory } = state;
    try {
      const newCategoryAdded = await services.categories.create(newCategory);
      state.categoriesList.push(newCategoryAdded);

      clearNewCategory();
      return true;
    } catch (ex) {
      // console.error(ex);
      return false;
    }
  }

  function readCategory(categoryId: string): Category | any {
    try {
      const { categoriesList = [] } = state;

      const categoryIndexToBeRead = categoriesList
        .findIndex((category: Category): boolean => {
          const { _id: categoryIndex } = category;
          return categoryIndex === categoryId;
        });

      if (categoryIndexToBeRead !== -1) {
        return categoriesList[categoryIndexToBeRead];
      }

      return {};
    } catch (ex) {
      // console.error(ex);
      return {};
    }
  }

  async function updateCategory(): Promise<boolean> {
    const { newCategory } = state;
    const { _id: categoryId } = newCategory;

    try {
      // call API to update category on DB
      const { categoriesList = [] } = state;

      const categoryIndexToBeUpdated = categoriesList
        .findIndex((category: Category): boolean => {
          const { _id: categoryIndex } = category;
          return categoryIndex === categoryId;
        });

      if (categoryIndexToBeUpdated !== -1) {
        state.categoriesList[categoryIndexToBeUpdated] = {
          ...state.categoriesList[categoryIndexToBeUpdated],
          ...newCategory,
        };
        clearNewCategory();
      }

      return true;
    } catch (ex) {
      // console.error(ex);
      return false;
    }
  }

  async function deleteCategory(categoryId: string): Promise<boolean> {
    try {
      // call API to remove category from DB
      const { categoriesList = [] } = state;

      const categoryIndexToBeRemoved = categoriesList
        .findIndex((category: Category): boolean => {
          const { _id: categoryIndex } = category;
          return categoryIndex === categoryId;
        });

      if (categoryIndexToBeRemoved !== -1) {
        state.categoriesList.splice(categoryIndexToBeRemoved, 1);
      }

      return true;
    } catch (ex) {
      // console.error(ex);
      return false;
    }
  }

  function clearData(): void {
    state.$reset();
  }

  return {
    clearData,
    clearNewCategory,
    setCategories,
    setAddingCategory,
    setEditingCategory,

    // CRUD
    createCategory,
    readCategory,
    updateCategory,
    deleteCategory,
  };
});
