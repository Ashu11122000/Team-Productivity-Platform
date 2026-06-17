import { createApiClient } from '../shared/create-api-client';

export const fastapiClient = createApiClient(
  `${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/v1`,
);
