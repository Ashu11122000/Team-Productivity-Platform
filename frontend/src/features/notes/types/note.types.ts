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