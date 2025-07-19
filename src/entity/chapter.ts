export interface Chapter {
  chapterId: string;
  novelId: string;
  title: string;
  content: string;
  chapterNumber: number;
  isPaid: boolean;
  price: number;
  scheduledAt: number;
  isLock: boolean;
  isDraft: boolean;
  isPublic: boolean;
  commentCount: number | null;
  createAt: number;
  updateAt: number;
}
