"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useActivityLogs } from "@/features/activity-logs/hooks/use-activity-logs";
import { ActivityLogFilters } from "@/features/activity-logs/components/activity-log-filters";
import { ActivityLogTable } from "@/features/activity-logs/components/activity-log-table";
import { ActivityLogSkeleton } from "@/features/activity-logs/components/activity-log-skeleton";

import { usePermissions } from "@/features/auth/hooks/use-permissions";
import { useAuthStore } from "@/store/auth-store";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ActivityLogsPage() {
  const router = useRouter();

  const hydrated = useAuthStore(
    (state) => state.hydrated
  );

  const { isAdmin } = usePermissions();

  // ALL HOOKS MUST BE CALLED BEFORE ANY RETURN

  const { data, isLoading, isError, error } =
    useActivityLogs();

  const [search, setSearch] =
    useState("");

  const [action, setAction] =
    useState("all");

  useEffect(() => {
    if (hydrated && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [
    hydrated,
    isAdmin,
    router,
  ]);

  const filteredLogs = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((log) => {
      const matchesSearch =
        log.description
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        log.action
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesAction =
        action === "all" ||
        log.action === action;

      return (
        matchesSearch &&
        matchesAction
      );
    });
  }, [
    data,
    search,
    action,
  ]);

  // RETURNS AFTER ALL HOOKS

  if (!hydrated) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ActivityLogSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="font-medium text-destructive">
            Failed to load activity logs.
          </p>

          {error instanceof Error && (
            <p className="mt-2 text-sm text-muted-foreground">
              {error.message}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Activity Logs
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <ActivityLogFilters
            search={search}
            action={action}
            onSearchChange={setSearch}
            onActionChange={setAction}
            onReset={() => {
              setSearch("");
              setAction("all");
            }}
          />

          <ActivityLogTable
            logs={filteredLogs}
          />

          {data && (
            <div className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
              <span>
                Showing {filteredLogs.length} of{" "}
                {data.total} activity logs
              </span>

              <span>
                Page {data.page} of{" "}
                {Math.max(
                  data.totalPages,
                  1
                )}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}