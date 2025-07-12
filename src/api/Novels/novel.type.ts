export interface CreateNovelRequest {
  title: string;
  description: string;
  authorId: string;
  novelImage: File | null;
  tags: string[];
  status: number;
  isPublic: boolean;
  isPaid: boolean;
  isLock: boolean;
  purchaseType: number;
  price: number;
}

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

export interface NovelReponse {
  novels: Novel[];
  totalNovels: number;
  totalPages: number;
}

export type NovelByAuthorResponse = {
  id: string;
  title: string;
  title_unsigned: string;
  description: string;
  author_id: string;
  novel_image: string;
  tags: string[];
  status: number;
  is_public: boolean;
  is_lock: boolean;
  is_paid: boolean;
  purchase_type: number;
  price: number;
  total_chapters: number;
  total_views: number;
  followers: number;
  rating_avg: number;
  rating_count: number;
  created_at: number;
  updated_at: number;
};

export interface Tag {
  tagId: string;
  name: string;
}

export type Novels = {
  success: boolean;
  message: string;
  data: NovelReponse;
};

export type NovelsByAuthor = {
  success: boolean;
  message: string;
  data: NovelByAuthorResponse[];
};

export type NovelUpdate = {
  success: boolean;
  message: string;
  data: NovelById;
};

type NovelById = {
  allChapters: [];
  novelInfo: NovelByAuthorResponse;
  purchasedChapterIds: [];
};
