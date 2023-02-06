import { Notification } from 'src/shared/interfaces';

export type NotificationsState = {
  addingNotification: boolean;
  editingNotification: boolean;
  newNotification: Notification;
  notificationsList: Notification[];
};

export default NotificationsState;
