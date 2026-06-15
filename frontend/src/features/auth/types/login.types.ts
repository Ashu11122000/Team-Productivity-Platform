export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    data: Record<string, unknown>;
    access_token: string;
    token_type: string;
}