export interface DiscordAccount {}

export interface EmailAccount {
  accountType: string;
  user: string;
  password: string;

  smtp?: string;
  port?: number;
  useTLS?: boolean;
}

export interface SlackAccount {}

export interface TeamsAccount {}

export interface TelegramAccount {}

export interface NotificationData {
  enable: boolean;
  name: string;
  type: string;
  options: EmailAccount | SlackAccount |
  TeamsAccount | TelegramAccount | DiscordAccount;
  created: string;

  _id: string;
  modified?: string;
}
