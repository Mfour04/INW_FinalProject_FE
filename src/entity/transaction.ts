export type Transaction = {
  requester_id: string;
  novel_id: string;
  chapter_id: string | null;
  type: number;
  amount: number;
  payment_method: string;
  status: number;
  completed_at: number;
  bank_account_name: string | null;
  bank_account_number: string | null;
  id: string;
  created_at: number;
  updated_at: number;
};
