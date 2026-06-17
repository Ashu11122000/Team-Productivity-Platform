import { createApiClient } from '../shared/create-api-client';

export const nestjsClient = createApiClient(
  process.env.NEXT_PUBLIC_NESTJS_URL!,
);
