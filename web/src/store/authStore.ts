import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  tenant: Tenant | null;
  login: (token: string, user: User, tenant: Tenant) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      tenant: null,
      login: (token, user, tenant) => set({ token, user, tenant }),
      logout: () => set({ token: null, user: null, tenant: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Computed property for authentication status
export const useIsAuthenticated = () => {
  const token = useAuthStore((state) => state.token);
  return !!token;
};
