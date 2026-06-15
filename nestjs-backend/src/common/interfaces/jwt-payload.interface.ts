/* eslint-disable prettier/prettier */

export interface JwtPayload {
  sub: string;
  user_id: string;
  role: string;
  iss: string;
  aud: string;
  iat?: number;
  exp?: number;
}