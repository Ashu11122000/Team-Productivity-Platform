export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    data: any;
    access_token: string;
    token_type: string;
}