import type { Tag } from "./tag";

export interface Novel {
  novelId: string;
  title: string;
  slug: string;
  description: string;
  authorId: string;
  authorName: string;
  novelImage: string | null;
  novelBanner: string | null;
  tags: Tag[];
  status: number;
  isPublic: boolean;
  allowComment: boolean;
  isPaid: boolean;
  isLock: boolean;
  price: number;
  totalChapters: number;
  totalViews: number;
  followers: number;
  commentCount: number;
  ratingAvg: number;
  ratingCount: number;
  createAt: number;
  updateAt: number;
}
