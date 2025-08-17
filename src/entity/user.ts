import type { Role } from "../context/AuthContext/AuthProvider";
import type { Tag } from "./tag";

export interface User {
  userId: string;
  userName: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  bio: string | null;
  role: Role;
  isVerified: boolean;
  isBanned: boolean;
  coin: number;
  blockCoin: number;
  novelFollowCount: number;
  badgeId: string[];
  lastLogin: number;
  favouriteType: Tag[];
}
