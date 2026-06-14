'use client';

import { useCurrentUser } from '../hooks/use-current-user';

export function AuthInitializer() {
    useCurrentUser();

    return null;
}