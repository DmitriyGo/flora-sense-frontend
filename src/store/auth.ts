import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  email: string;
  roles: Role[];
  accessToken: string;
}

interface AuthState {
  user: User | null;
  saveUser: (user: User) => void;
  updateToken: (token: string) => void;
  updateRoles: (roles: Role[]) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      saveUser: (user) =>
        set((state) => ({
          ...state,
          user: user,
        })),
      updateToken: (token) =>
        set((state) => {
          if (state.user) {
            return {
              ...state,
              user: {
                ...state.user,
                accessToken: token,
              },
            };
          }
          return state;
        }),
      updateRoles: (roles) =>
        set((state) => {
          if (state.user) {
            return {
              ...state,
              user: {
                ...state.user,
                roles,
              },
            };
          }
          return state;
        }),
      clearUser: () => set(() => ({ user: null })),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
