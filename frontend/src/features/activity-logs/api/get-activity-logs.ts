import { nestjsClient } from "@/services/nestjs/client";
import { ActivityLogsResponse } from "../types/activity-log.types";

export const getActivityLogs = async (): Promise<ActivityLogsResponse> => {
  const { data } = await nestjsClient.get<ActivityLogsResponse>(
    "/activity-logs"
  );

  return data;
};