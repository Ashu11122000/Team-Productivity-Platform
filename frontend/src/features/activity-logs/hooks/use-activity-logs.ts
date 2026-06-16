import { useQuery } from "@tanstack/react-query";
import { getActivityLogs } from "../api/get-activity-logs";

export const useActivityLogs = () => {
  return useQuery({
    queryKey: ["activity-logs"],
    queryFn: getActivityLogs,
  });
};