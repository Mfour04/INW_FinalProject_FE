import React, { createContext, useState } from 'react';

interface User {
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

interface AuthState {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface AuthContextType {
  auth: AuthState | null;
  setAuth: (auth: AuthState | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  auth: null,
  setAuth: () => {},
  logout: () => {},
});

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthState | null>(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
  });

  const saveAuth = (authData: AuthState | null) => {
    localStorage.setItem('auth', JSON.stringify(authData));
    setAuth(authData);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth: saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
