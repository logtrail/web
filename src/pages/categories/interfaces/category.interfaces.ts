export interface NotificationDestination {
  notificationName: string;
  destination: string;
}

export interface CategoryData {
  _id: string;
  name: string;
  level: 'info' | 'warning' | 'danger';
  logTypeId: string;
  notifications: NotificationDestination[];
  created: string;
  logTypeName: string;
}
