/* eslint-disable prettier/prettier */
import { Role } from "../constants/roles.constants";

export interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
    iss: string;
    aud: string;
    type: string;
    iat?: number;
    exp?: number;
}