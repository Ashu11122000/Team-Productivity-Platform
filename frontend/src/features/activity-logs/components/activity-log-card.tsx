import { ActivityLog } from "../types/activity-log.types";

interface Props {
  log: ActivityLog;
}

export function ActivityLogCard({
  log,
}: Props) {
  return (
    <div className="rounded-xl border p-4">
      <h4 className="font-medium">
        {log.action}
      </h4>

      <p className="text-sm text-muted-foreground">
        {log.description}
      </p>

      <p className="mt-2 text-xs text-muted-foreground">
        {new Date(log.createdAt).toLocaleString()}
      </p>
    </div>
  );
}