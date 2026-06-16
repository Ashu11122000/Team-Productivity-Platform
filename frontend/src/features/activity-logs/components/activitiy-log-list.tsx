import { ActivityLogCard } from "./activity-log-card";
import { ActivityLog } from "../types/activity-log.types";

interface Props {
  logs: ActivityLog[];
}

export function ActivityLogList({
  logs,
}: Props) {
  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <ActivityLogCard
          key={log.id}
          log={log}
        />
      ))}
    </div>
  );
}