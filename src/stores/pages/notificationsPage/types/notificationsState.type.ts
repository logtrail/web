import Notification from './notification.type';

export type NotificationsState = {
  addingNotification: boolean;
  editingNotification: boolean;
  newNotification: Notification;
  notificationsList: Notification[];
};

export default NotificationsState;
