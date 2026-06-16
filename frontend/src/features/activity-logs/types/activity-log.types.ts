export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  createdAt: string;
}

export interface ActivityLogsResponse {
  data: ActivityLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}