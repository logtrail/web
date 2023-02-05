/**
 * Email account type
 */
export interface EmailAccountType {
  accountType: string;
  user: string;
  password: string;

  smtp?: string;
  port?: number;
  useTLS?: boolean;
}

/**
 * Notification
 */
export interface Notification {
  enable: boolean;
  name: string;
  type: string;
  options: EmailAccountType;
  _id?: string;
  created?: string;
  modified?: string;
}
