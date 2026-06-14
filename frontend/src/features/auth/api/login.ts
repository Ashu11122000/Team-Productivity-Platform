import { fastapiClient } from "@/services/fastapi/client";
import { LoginRequest, LoginResponse } from "../types/login.types";

export async function login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fastapiClient.post<LoginResponse>(
        '/auth/login',
        data,
    );

    return response.data;
}