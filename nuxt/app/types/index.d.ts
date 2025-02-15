import type { Avatar } from "#ui/types";

export type UserStatus = "subscribed" | "unsubscribed" | "bounced";

export type Accounts = {
  name: string;
  nickname: string;
};

export type Trade = {
    identifier: string,
    symbol: string,
    symbol_tw: string,
    direction: "long" | "short",
    symbolOriginal: string,
    timeframe: string,
    entryTime: number,
    exitTime: number,
    day_of_week: number,
    quantity: number,
    entry: number,
    target: number,
    stop: number,
    exit: number,
    outcome: "win" | "loss" | "be",
    rr: number,
    rrr: number,
    fees: number,
    netProceeds: number,
    grossProceeds: number | 0,
    session: string | null,
}

export type Backtest = {
  id: number|null;
  name: string;
  starting_balance: number;
  ending_balance: number;
  wins: number;
  losses: number;
  break_evens: number;
  gain: number;
  totalR: number;
  percentage: number;
  group: object;
  trades: string[];
  symbols: string[];
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
