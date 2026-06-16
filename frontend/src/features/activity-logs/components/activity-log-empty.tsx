import { FileText } from "lucide-react";

export function ActivityLogEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <FileText className="h-10 w-10 text-muted-foreground" />
      <p className="mt-3 text-muted-foreground">
        No activity logs found.
      </p>
    </div>
  );
}