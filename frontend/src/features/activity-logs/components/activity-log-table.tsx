"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { ActivityLog } from "../types/activity-log.types";

interface ActivityLogTableProps {
  logs: ActivityLog[];
}

export function ActivityLogTable({
  logs,
}: ActivityLogTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-24 text-center"
              >
                No activity logs found.
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <Badge variant="secondary">
                    {formatAction(log.action)}
                  </Badge>
                </TableCell>

                <TableCell>
                  {log.description}
                </TableCell>

                <TableCell>
                  {new Date(
                    log.createdAt
                  ).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function formatAction(action: string) {
  return action
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}