import Link from "next/link";

import {
Card,
CardContent,
CardHeader,
CardTitle,
} from "@/components/ui/card";

import { Note } from "@/features/notes/types/note.types";

interface Props {
notes: Note[];
}

export function RecentNotesWidget({
notes,
}: Props) {
return ( <Card> <CardHeader> <div className="flex items-center justify-between"> <CardTitle>
Recent Notes </CardTitle>

```
      <Link
        href="/notes"
        className="text-sm text-primary"
      >
        View All
      </Link>
    </div>
  </CardHeader>

  <CardContent>
    <div className="space-y-3">
      {notes
        .slice(0, 5)
        .map((note) => (
          <div
            key={note.id}
            className="border-b pb-2"
          >
            <p className="font-medium">
              {note.title}
            </p>

            <p className="text-xs text-muted-foreground">
              {new Date(
                note.created_at,
              ).toLocaleDateString()}
            </p>
          </div>
        ))}
    </div>
  </CardContent>
</Card>
);
}
