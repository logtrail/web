import { defineStore } from 'pinia';

import CategoriesState from './types/categoriesState.type';

export const useState = defineStore({
  id: 'categories.state',

  state: (): CategoriesState => ({
    addingCategory: false,
    editingCategory: false,

    newCategory: {
      name: '',
      level: '',
      logTypeId: '',
      notifications: [
        {
          notificationId: '',
          destination: '',
        },
      ],
    },
    categoriesList: [],
  }),
});
