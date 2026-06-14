import { fastapiClient } from "@/services/fastapi/client";

export async function logout() {
    const response = await fastapiClient.post('/auth.logout');

    return response.data;
}