import type { Role } from "../../context/AuthContext/AuthProvider";

export interface User {
  userId: string;
  userName: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  role: Role;
  isVerified: boolean;
  isBanned: boolean;
  coin: number;
  blockCoin: number;
  novelFollowCount: number;
  badgeId: string[];
  lastLogin: number;
  favouriteType: string[];
}

export interface RegisterUser {
  username: string;
  displayname: string;
  displayname_normalized: string;
  email: string;
  password: string;
  avata_url: string | null;
  bio: string | null;
  role: Role;
  is_verified: boolean;
  is_banned: boolean;
  coin: number;
  novel_follow_count: number;
  badge_id: string[];
  last_login: number;
  id: string;
  created_at: number;
  updated_at: number;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginResponse {
  message: string;
  token: Token;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: RegisterUser;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}
