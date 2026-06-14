import axios from 'axios';

export const fastapiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_FASTAPI_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});