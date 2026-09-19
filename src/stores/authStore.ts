import { create } from 'zustand';

export interface DemoUser {
  id: string;
  email: string;
}

export interface DemoSession {
  user: DemoUser;
}

interface AuthState {
  session: DemoSession | null;
  user: DemoUser | null;
  loading: boolean;
  initialize: () => () => void;
  logout: () => Promise<void>;
}

const DEMO_USER: DemoUser = {
  id: 'demo-user-123',
  email: 'demo@mywallet.app',
};

export const useAuthStore = create<AuthState>((set) => ({
  session: { user: DEMO_USER },
  user: DEMO_USER,
  loading: false,
  initialize: () => {
    set({ session: { user: DEMO_USER }, user: DEMO_USER, loading: false });
    return () => {};
  },
  logout: async () => {
    // In demo, resetting session simply re-authenticates as demo user
    set({ session: { user: DEMO_USER }, user: DEMO_USER });
  },
}));
