import { create } from 'zustand';
import { User, Tokens } from '@/types/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: number | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setAuth: (user: User, tokens: Tokens) => void;
  setAccessToken: (token: string, expiresIn: number) => void;
  setRefreshToken: (token: string) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  accessTokenExpiresAt: null,
  isLoading: false,
  isAuthenticated: false,

  setAuth: (user, tokens) => {
    const expiresAt = Date.now() + tokens.accessTokenExpiresIn * 1000;
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('accessTokenExpiresAt', expiresAt.toString());

    set({
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenExpiresAt: expiresAt,
      isAuthenticated: true,
    });
  },

  setAccessToken: (token, expiresIn) => {
    const expiresAt = Date.now() + expiresIn * 1000;
    localStorage.setItem('accessTokenExpiresAt', expiresAt.toString());
    set({
      accessToken: token,
      accessTokenExpiresAt: expiresAt,
    });
  },

  setRefreshToken: (token) => {
    localStorage.setItem('refreshToken', token);
    set({ refreshToken: token });
  },

  logout: () => {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessTokenExpiresAt');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresAt: null,
      isAuthenticated: false,
    });
  },

  isTokenExpired: () => {
    const expiresAt = get().accessTokenExpiresAt;
    if (!expiresAt) return true;
    return Date.now() > expiresAt - 60000; // 1 min buffer
  },
}));
