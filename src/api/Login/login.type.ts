export interface User {
  userId: string;
  username: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  bio: string | null;
  coin: number;
  badgeId: string[];
  createdAt: string;
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


export interface LoginParams {
    username: string,
    password: string
}