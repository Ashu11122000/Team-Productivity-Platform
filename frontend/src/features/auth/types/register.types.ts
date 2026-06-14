export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterResponse {
    id: string;
    email: string;
    role: string;
}