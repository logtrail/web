export type EmailAccountType = {
  accountType: string;
  user: string;
  password: string;

  smtp?: string;
  port?: number;
  useTLS?: boolean;
};

export default EmailAccountType;
