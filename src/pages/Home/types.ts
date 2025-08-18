export type TagType = { tagId: string; name?: string };
export type Novel = {
  novelId: string;
  title: string;
  slug: string;
  novelImage?: string;
  description?: string;
  tags?: TagType[];
  totalViews?: number;
  ratingCount?: number;
};