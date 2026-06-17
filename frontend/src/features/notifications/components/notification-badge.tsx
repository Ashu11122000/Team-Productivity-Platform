'use client';

interface Props {
  count: number;
}

export function NotificationBadge({
  count,
}: Props) {
  if (!count) {
    return null;
  }

  return (
    <span
      className="
        inline-flex
        min-w-6
        items-center
        justify-center
        rounded-full
        border
        border-rose-500/20
        bg-rose-500/10
        px-2
        py-1
        text-xs
        font-semibold
        text-rose-600
        shadow-sm
        backdrop-blur-sm
      "
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}