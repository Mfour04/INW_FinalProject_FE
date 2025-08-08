export interface User {
  userId: string;
  userName: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  bio: string | null;
  role: "User" | "Admin";
  isVerified: boolean;
  isBanned: boolean;
  bannedUntil: number | null;
  coin: number;
  blockCoin: number;
  novelFollowCount: number;
  badgeId: string[];
  lastLogin: number;
  favouriteType: string[];
  readCount: number; // Thêm để tương thích với UserTopSection
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}
