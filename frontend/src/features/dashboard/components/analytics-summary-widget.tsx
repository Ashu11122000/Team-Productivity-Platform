import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AnalyticsSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalCategories: number;
  totalNotifications: number;
}

interface Props {
  analytics?: AnalyticsSummary;
}

export function AnalyticsSummaryWidget({
  analytics,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card>
        <CardHeader>
          <CardTitle>
            Total Tasks
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">
            {analytics?.totalTasks ?? 0}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Completed
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">
            {analytics?.completedTasks ??
              0}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Pending
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">
            {analytics?.pendingTasks ??
              0}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Categories
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">
            {analytics?.totalCategories ??
              0}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Notifications
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">
            {analytics?.totalNotifications ??
              0}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}