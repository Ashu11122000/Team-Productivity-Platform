export interface Note {
  id: number;
  title: string;
  content: string | null;

  owner_id: number;

  book_reference_id: string | null;

  is_converted_to_task: boolean;

  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
}