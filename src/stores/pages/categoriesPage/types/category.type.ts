import NotificationInCategory from './notificationInCategory.type';

export type Category = {
  name: string;
  level: string;
  logType: string;
  notifications: NotificationInCategory[];

  _id?: string;
  created?: string;
  modified?: string;
};

export default Category;
