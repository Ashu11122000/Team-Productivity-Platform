import { fastapiClient } from "@/services/fastapi/client";
import { RegisterRequest, RegisterResponse } from "../types/register.types";

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fastapiClient.post<RegisterResponse>(
        '/auth/register', data
    );

    return response.data;
}