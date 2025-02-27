import type { ButtonColor } from '#ui/types'

export type Provider = {
    name: string;
    icon: string;
    color: ButtonColor;
    loading?: boolean;
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
    sessions: TradingSession[];
};