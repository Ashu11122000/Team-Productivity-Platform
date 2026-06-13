// src/common/constants/roles.constants.ts

/* eslint-disable prettier/prettier */

export const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];