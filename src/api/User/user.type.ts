import type { Tag } from "../Tags/tag.type";

export interface UserInfo {
  UserId: string;
  DisplayName: string;
  Bio: string;
  AvatarUrl: string;
  CoverUrl: string;
}

export type UpdateFavoriteTypeRequest = {
  userId: string;
  displayName: string;
  bio: string;
  AvatarUrl: string;
  BadgeId: string[];
  FavouriteType: Tag[];
};
