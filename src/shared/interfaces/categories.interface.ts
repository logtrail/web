/**
 * Notification data to send after receiver one event
 */
interface Notification {
  notificationId: string;
  destination: string;
}

/**
 * Category by event
 */
export interface Category {
  name: string;
  level: string;
  logTypeId: string;
  logTypeName?: string;
  notifications?: Notification[];
}


