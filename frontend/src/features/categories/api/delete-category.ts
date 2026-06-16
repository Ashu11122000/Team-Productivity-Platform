import { nestjsClient } from '@/services/nestjs/client';

export async function deleteCategory(
  id: string,
): Promise<void> {
  await nestjsClient.delete(
    `/categories/${id}`,
  );
}