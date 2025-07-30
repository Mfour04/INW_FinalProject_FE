import type { Tag } from "../Tags/tag.type";

export type UpdateFavoriteTypeRequest = {
  userId: string;
  displayName: string;
  bio: string;
  AvataUrl: string;
  BadgeId: string[];
  FavouriteType: Tag[];
};
