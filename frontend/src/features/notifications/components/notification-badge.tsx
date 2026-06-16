'use client';

interface Props {
  count: number;
}

export function NotificationBadge({
  count,
}: Props) {
  if (!count) return null;

  return (
    <span className="rounded-full bg-red-500 px-2 py-1 text-xs text-white">
      {count}
    </span>
  );
}