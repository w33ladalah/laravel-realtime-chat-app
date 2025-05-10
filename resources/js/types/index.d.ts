import { PageProps as InertiaPageProps } from '@inertiajs/core';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export type PageProps<T = Record<string, unknown>> = InertiaPageProps<T> & {
    auth: {
        user: User;
    };
};

declare global {
    interface ImportMeta {
        env: {
            VITE_REVERB_APP_KEY: string;
            VITE_REVERB_PORT: string;
        };
    }
}
