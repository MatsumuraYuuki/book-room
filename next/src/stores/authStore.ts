import { User } from '@/types/common';
import camelcaseKeys from 'camelcase-keys';
import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthTokens {
  accessToken: string;
  client: string;
  uid: string;
}

// 認証コンテキストの型定義
interface AuthStore {
  // 状態  
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  authTokens: AuthTokens | null;
  hasHydrated: boolean;

  // アクション
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAuthTokens: (authTokens: AuthTokens | null) => void;
  setHasHydrated: (hasHydrated: boolean) => void

  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signIn: (email: string, password: string) => Promise<boolean>
  guestSignIn: () => Promise<boolean>
  signOut: () => void;
}


// setはコールバック関数として子要素に渡すために記述されている
// set = useStateの第二引数的な役割
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // 初期値
      user: null,
      isLoggedIn: false,
      loading: false,
      error: null,
      authTokens: null,
      hasHydrated: false,

      // アクション            　user, はuser: userの省略記法
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setAuthTokens: (authTokens) => set({ authTokens }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      signOut: () => set({ user: null, isLoggedIn: false, error: null, authTokens: null }),
      signUp: async (name: string, email: string, password: string) => {
        const { setUser, setLoading, setError, setAuthTokens } = get()
        setLoading(true);
        setError(null);

        try {
          // Rails側はregistrationというキーでネストされたデータを期待している
          const requestBody = {
            registration: {
              name,
              email,
              password,
              password_confirmation: password
            }
          };

          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`, requestBody);

          const accessToken = response.headers['access-token']
          const client = response.headers['client']
          const uid = response.headers['uid']
          if (accessToken && client && uid) {
            setAuthTokens({ accessToken, client, uid })
          }

          const userInfo = response.data.data;
          //取得したuserをcamelcaseに変換
          const camelCasedUser = camelcaseKeys(userInfo, { deep: true });

          setUser(camelCasedUser);
          setLoading(false);
          return true;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            setError(error.response.data.errors?.full_messages?.[0] || 'アカウント登録に失敗しました')
          } else {
            setError('ネットワークエラーが発生しました')
          }
          setLoading(false);
          return false;
        }
      },
      signIn: async (email: string, password: string) => {
        const { setUser, setLoading, setError, setAuthTokens } = get()
        setLoading(true);
        setError(null);

        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/sign_in`, {
            email,
            password
          });

          const accessToken = response.headers['access-token']
          const client = response.headers['client']
          const uid = response.headers['uid']
          if (accessToken && client && uid) {
            setAuthTokens({ accessToken, client, uid })
          }

          const userInfo = response.data.data;
          //取得したuserをcamelcaseに変換
          const camelCasedUser = camelcaseKeys(userInfo, { deep: true });

          setUser(camelCasedUser);
          setLoading(false);
          return true;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            setError('メールアドレスまたはパスワードが間違っています')
          } else {
            setError('ネットワークエラーが発生しました')
          }
          setLoading(false);
          return false;
        }
      },
      guestSignIn: async () => {
        const { setUser, setLoading, setError, setAuthTokens } = get()
        setLoading(true);
        setError(null);

        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/guest_sign_in`);

          const accessToken = response.headers['access-token']
          const client = response.headers['client']
          const uid = response.headers['uid']
          if (accessToken && client && uid) {
            setAuthTokens({ accessToken, client, uid })
          }

          const userInfo = response.data.data;
          //取得したuserをcamelcaseに変換
          const camelCasedUser = camelcaseKeys(userInfo, { deep: true });

          setUser(camelCasedUser);
          setLoading(false);
          return true;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            setError('ゲストログインに失敗しました')
          } else {
            setError('ネットワークエラーが発生しました')
          }
          setLoading(false);
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        authTokens: state.authTokens,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);