import { defineStore } from 'pinia';

import { computed } from 'vue';
import { useState } from './state';

export const useGetters = defineStore('notifications.getters', () => {
  const state = useState();

  const isAddingNotification = computed((): boolean => {
    const { addingNotification = false } = state;
    return addingNotification;
  });

  const isEditingNotification = computed((): boolean => {
    const { editingNotification = false } = state;
    return editingNotification;
  });

  const allNotifications = computed((): object[] => {
    const { notificationsList = [] } = state;

    return notificationsList;
  });

  return {
    isAddingNotification,
    isEditingNotification,
    allNotifications,
  };
});
