import type { Avatar } from "#ui/types";

export type UserStatus = "subscribed" | "unsubscribed" | "bounced";

export type Accounts = {
  name: string;
  nickname: string;
};

export type User = {
  ulid: string;
  name: string;
  email: string;
  avatar: string;
  must_verify_email: boolean;
  has_password: boolean;
  roles: string[];
  providers: string[];
  timezone: string;
  unixes: string[];
  accounts: Account[];
};

export interface Playbook {
  id: string,
  title: string,
  body: string,
  created_at: string,
  updated_at: string
}

export interface Mail {
  id: number;
  unread?: boolean;
  from: User;
  subject: string;
  body: string;
  date: string;
}

export interface Account {
  name: string;
  nickname: string;
  color: string;
  id: string;
}

export interface Notification {
  id: number;
  unread?: boolean;
  sender: User;
  body: string;
  date: string;
}

export type Period = "daily" | "weekly" | "monthly";

export type ProceedsType = "net" | "gross";

export interface Range {
  start: Date;
  end: Date;
}
