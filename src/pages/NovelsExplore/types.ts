export type ViewMode = "Grid" | "List";

export type Tag = { tagId: string; name?: string; slug?: string };

export type NovelLite = {
  novelId: string;
  title: string;
  slug: string;
  novelImage?: string | null;
  ratingAvg?: number;
  bookmarkCount?: number;
  totalViews?: number;
  status: number; // 1 = completed, else ongoing
  tags?: Tag[];
};
