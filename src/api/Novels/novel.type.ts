export interface CreateNovelRequest {
  title: string
  description: string
  authorId: string
  novelImage: File | null
  tags: string[]
  status: number
  isPublic: boolean
  isPaid: boolean
  isLock: boolean
  purchaseType: number
  price: number
}

export interface NovelReponse {
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

export interface Tag {
  tagId: string;
  name: string;
};

export type Novels = {
    success: boolean,
    message: string,
    data: NovelReponse[]
}