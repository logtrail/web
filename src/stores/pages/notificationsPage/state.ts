import { defineStore } from 'pinia';

import NotificationsState from './types/notificationsState.type';

export const useState = defineStore({
  id: 'notifications.state',

  state: (): NotificationsState => ({
    addingNotification: false,
    editingNotification: false,

    newNotification: {
      type: 'email',
      enable: true,
      name: '',
      options: {},
    },
    notificationsList: [],
  }),
});
