type Author = {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
};

export type Rating = {
  ratingId: string;
  novelId: string;
  author: Author;
  score: number;
  content: string;
  createdAt: number;
  updatedAt: number;
};
