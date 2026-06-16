import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Notification } from "@/features/notifications/types/notification.types";

interface Props {
  notifications: Notification[];
}

export function NotificationsWidget({
  notifications,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Notifications
          </CardTitle>

          <Link
            href="/notifications"
            className="text-sm text-primary"
          >
            View All
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No notifications
            </p>
          ) : (
            notifications.map(
              (notification) => (
                <div
                  key={
                    notification.id
                  }
                  className="border-b pb-2"
                >
                  <p className="font-medium">
                    {
                      notification.title
                    }
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {
                      notification.message
                    }
                  </p>
                </div>
              ),
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}