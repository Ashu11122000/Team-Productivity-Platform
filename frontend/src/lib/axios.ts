import axios from "axios";

export const nestApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NESTJS_URL,
});

export const fastApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FASTAPI_URL,
});