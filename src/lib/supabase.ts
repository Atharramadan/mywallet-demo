export const supabase = {
  auth: {
    getSession: async () => ({
      data: {
        session: {
          user: {
            id: 'demo-user-123',
            email: 'athar.demo@mywallet.app',
            user_metadata: { name: 'Athar Ramadhan' },
          },
        },
      },
    }),
    signInWithPassword: async (_creds?: any) => ({ error: null }),
    signUp: async (_creds?: any) => ({ error: null }),
    updateUser: async (_data?: any) => ({ error: null }),
    signOut: async () => ({ error: null }),
  },
};

export const getUserId = async () => 'demo-user-123';
export const generateLocalId = () => Date.now() % 2147483647 + Math.floor(Math.random() * 1000);