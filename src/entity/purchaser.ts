export type Purchaser = {
  user_id: string;
  novel_id: string;
  chapter_ids: string[];
  chap_snapshot: number;
  is_full: boolean;
  id: string;
  created_at: number;
  updated_at: number;
};
