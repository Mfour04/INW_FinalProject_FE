export type Novel = {
  novelId: string;
  slug: string;
  title: string;
  novelImage?: string | null;
  status: number;      
  createAt: number;   
  followers: number;
  totalViews: number;
};

export type NovelsData = {
  novels: Novel[];
};

export type StatusFilter = "all" | "ongoing" | "finished";
export type SortKey = "updated" | "views" | "followers" | "title";
