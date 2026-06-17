import { createApiClient } from '../shared/create-api-client';

const FASTAPI_URL =
  process.env.NEXT_PUBLIC_FASTAPI_URL ||
  'http://localhost:8000';

export const fastapiClient = createApiClient(
  `${FASTAPI_URL}/api/v1`,
);