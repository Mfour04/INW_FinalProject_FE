export interface Chapter {
  id: string;
  novel_id: string;
  title: string;
  content: string;
  chapter_number: number;
  is_paid: boolean;
  price: number;
  scheduled_at: number;
  is_lock: boolean;
  is_draft: boolean;
  is_public: boolean;
  comment_count: number | null;
  created_at: number;
  updated_at: number;
}
