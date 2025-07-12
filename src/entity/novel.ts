import type { Tag } from "./tag";

export interface Novel {
  novelId: string;
  title: string;
  description: string;
  authorId: string;
  novelImage: string | null;
  tags: Tag[];
  status: number;
  isPublic: boolean;
  isPaid: boolean;
  isLock: boolean;
  purchaseType: number;
  price: number;
  totalChapters: number;
  totalViews: number;
  followers: number;
  ratingAvg: number;
  ratingCount: number;
}
