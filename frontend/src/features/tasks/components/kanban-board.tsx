'use client';

import { useTaskKanban } from '../hooks/use-task-kanban';

import { KanbanColumn } from './kanban-column';

export function KanbanBoard() {
  const {
    columns,
    isLoading,
  } = useTaskKanban();

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map(
          (_, index) => (
            <div
              key={index}
              className="
                rounded-3xl
                border
                border-white/20
                bg-white/70
                p-6
                backdrop-blur-xl
                shadow-lg
              "
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200" />

                <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
              </div>

              <div className="space-y-4">
                {Array.from({
                  length: 4,
                }).map((_, i) => (
                  <div
                    key={i}
                    className="
                      h-28
                      animate-pulse
                      rounded-3xl
                      bg-slate-200
                    "
                  />
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="
          absolute
          -left-24
          top-20
          h-72
          w-72
          rounded-full
          bg-cyan-400/20
          blur-[160px]
        "
      />

      <div
        className="
          absolute
          -right-24
          top-32
          h-72
          w-72
          rounded-full
          bg-violet-400/20
          blur-[160px]
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-1/2
          h-72
          w-72
          -translate-x-1/2
          rounded-full
          bg-indigo-400/20
          blur-[160px]
        "
      />

      <div className="relative grid gap-6 lg:grid-cols-3">
        <KanbanColumn
          title="TODO"
          tasks={columns.TODO}
        />

        <KanbanColumn
          title="IN_PROGRESS"
          tasks={columns.IN_PROGRESS}
        />

        <KanbanColumn
          title="COMPLETED"
          tasks={columns.COMPLETED}
        />
      </div>
    </div>
  );
}