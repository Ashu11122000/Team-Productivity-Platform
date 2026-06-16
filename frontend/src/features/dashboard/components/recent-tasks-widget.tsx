import Link from "next/link";

import {
Card,
CardContent,
CardHeader,
CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Task } from "@/features/tasks/types/task.types";

interface Props {
tasks: Task[];
}

export function RecentTasksWidget({
tasks,
}: Props) {
return ( <Card> <CardHeader> <div className="flex items-center justify-between"> <CardTitle>
Recent Tasks </CardTitle>

```
      <Link
        href="/tasks"
        className="text-sm text-primary"
      >
        View All
      </Link>
    </div>
  </CardHeader>

  <CardContent>
    <div className="space-y-3">
      {tasks
        .slice(0, 5)
        .map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between border-b pb-2"
          >
            <div>
              <p className="font-medium">
                {task.title}
              </p>

              <p className="text-xs text-muted-foreground">
                {task.status}
              </p>
            </div>

            <Badge>
              {task.priority}
            </Badge>
          </div>
        ))}
    </div>
  </CardContent>
</Card>
);
}
