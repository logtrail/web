import EmailAccount from './accountTypes/emailAccount.type';
import SlackAccount from './accountTypes/slackAccount.type';
import TeamsAccount from './accountTypes/teamsAccount.type';
import TelegramAccount from './accountTypes/telegramAccount.type';
import DiscordAccount from './accountTypes/discordAccount.type';

export type Notification = {
  enable: boolean;
  name: string;
  type: string;
  options: EmailAccount | SlackAccount |
  TeamsAccount | TelegramAccount | DiscordAccount;

  _id?: string;
  created?: string;
  modified?: string;
};

export default Notification;
