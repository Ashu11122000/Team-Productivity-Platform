export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <OverviewCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <TaskStatusChart />
        <PriorityChart />
      </div>

      <ProductivityChart />
    </div>
  );
}