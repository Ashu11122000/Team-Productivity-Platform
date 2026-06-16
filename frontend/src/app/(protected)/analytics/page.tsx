import { OverviewCards } from '@/features/analytics/components/overview-cards';
import { TaskStatusChart } from '@/features/analytics/components/task-status-chart';
import { PriorityChart } from '@/features/analytics/components/priority-chart';
import { ProductivityChart } from '@/features/analytics/components/productivity-chart';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Analytics
        </h1>

        <p className="text-muted-foreground">
          Productivity insights and task metrics
        </p>
      </div>

      <OverviewCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <TaskStatusChart />
        <PriorityChart />
      </div>

      <ProductivityChart />
    </div>
  );
}