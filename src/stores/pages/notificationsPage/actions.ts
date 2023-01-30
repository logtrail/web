import { defineStore } from 'pinia';
import { uid } from 'quasar';

import { useState } from './state';
import Notification from './types/notification.type';

export const useActions = defineStore('notifications.actions', () => {
  const state = useState();

  function setAddingNotification(isAdding: boolean): void {
    state.addingNotification = isAdding;
  }

  function setEditingNotification(isEditing: boolean): void {
    state.editingNotification = isEditing;
  }

  function clearNewNotification() {
    setAddingNotification(false);
    setEditingNotification(false);
    state.newNotification = {
      type: 'email',
      enable: true,
      name: '',
      options: {},
    };
  }

  async function createNotification(): Promise<boolean> {
    const id = uid();
    const created = '';
    const modified = '';

    const { newNotification } = state;
    try {
      // call API to add notification on DB
      state.notificationsList.push({
        ...newNotification,
        _id: id,
        created,
        modified,
      });

      clearNewNotification();
      return true;
    } catch (ex) {
      // console.error(ex);
      return false;
    }
  }

  function readNotification(notificationId: string): Notification | any {
    try {
      const { notificationsList = [] } = state;

      const notificationIndexToBeRead = notificationsList
        .findIndex((notification: Notification): boolean => {
          const { _id: notificationIndex } = notification;
          return notificationIndex === notificationId;
        });

      if (notificationIndexToBeRead !== -1) {
        return notificationsList[notificationIndexToBeRead];
      }

      return {};
    } catch (ex) {
      // console.error(ex);
      return {};
    }
  }

  async function updateNotification(): Promise<boolean> {
    const { newNotification } = state;
    const { _id: notificationId } = newNotification;

    try {
      // call API to update notification on DB
      const { notificationsList = [] } = state;

      const notificationIndexToBeUpdated = notificationsList
        .findIndex((notification: Notification): boolean => {
          const { _id: notificationIndex } = notification;
          return notificationIndex === notificationId;
        });

      if (notificationIndexToBeUpdated !== -1) {
        state.notificationsList[notificationIndexToBeUpdated] = {
          ...state.notificationsList[notificationIndexToBeUpdated],
          ...newNotification,
        };
        clearNewNotification();
      }

      return true;
    } catch (ex) {
      // console.error(ex);
      return false;
    }
  }

  async function deleteNotification(notificationId: string): Promise<boolean> {
    try {
      // call API to remove notification from DB
      const { notificationsList = [] } = state;

      const notificationIndexToBeRemoved = notificationsList
        .findIndex((notification: Notification): boolean => {
          const { _id: notificationIndex } = notification;
          return notificationIndex === notificationId;
        });

      if (notificationIndexToBeRemoved !== -1) {
        state.notificationsList.splice(notificationIndexToBeRemoved, 1);
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
    clearNewNotification,
    setAddingNotification,
    setEditingNotification,

    // CRUD
    createNotification,
    readNotification,
    updateNotification,
    deleteNotification,
  };
});
