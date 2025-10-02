import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// この情報のみローカルストレージに保存される/saveUserToStorageでセットされる
interface User {
  id: number;
  name: string;
  email: string;
}

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

  // アクション
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAuthTokens: (authTokens: AuthTokens | null) => void;

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
      // 既存の実装をここに移動
      user: null,
      isLoggedIn: false, 
      loading: false, 
      error: null, 
      authTokens: null,
      
      // アクション           //userはuser: userの省略記法
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setAuthTokens: (authTokens) => set({ authTokens }),
      
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

          const response = await fetch('http://localhost:3000/api/v1/auth',{
            method: "POST",
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });
      
          if (response.ok) {

            const accessToken = response.headers.get('access-token')
            const client = response.headers.get('client')
            const uid = response.headers.get('uid')
            if (accessToken && client && uid) {
              setAuthTokens({ accessToken, client, uid })
            }

            const userData = await response.json();
            const userInfo = userData.data;
      
            setUser(userInfo)
            setLoading(false);
            return true;
          } else {
            const errorData = await response.json();
            setError(errorData.errors?.full_messages?.[0] || 'アカウント登録に失敗しました')
            setLoading(false);
           return false;
          }
        } catch (error) {
          // 4. 失敗時の処理
          setError('ネットワークエラーが発生しました')
          setLoading(false);
          return false;
        }
      },
      signIn: async (email: string, password: string) => {
        // 1. ローディング開始とエラークリア
        // どうやって状態を更新する？
        const { setUser, setLoading, setError, setAuthTokens } = get()
        setLoading(true);
        setError(null);
        
        try {
          const response = await fetch('http://localhost:3000/api/v1/auth/sign_in',{
            method: "POST",
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
      
          if (response.ok) {

            const accessToken = response.headers.get('access-token')
            const client = response.headers.get('client')
            const uid = response.headers.get('uid')
            if (accessToken && client && uid) {
              setAuthTokens({ accessToken, client, uid })
            }

            const userData = await response.json();
            const userInfo = userData.data;      
      
            setUser(userInfo)
            setLoading(false);
            return true;
          } else {
            setError('メールアドレスまたはパスワードが間違っています')
            setLoading(false);
           return false;
          }
        } catch (error) {
          // 4. 失敗時の処理
          setError('ネットワークエラーが発生しました')
          setLoading(false);
          return false;
        }
      },
      guestSignIn: async () => {
        // 1. ローディング開始とエラークリア
        // どうやって状態を更新する？
        const { setUser, setLoading, setError, setAuthTokens } = get()
        setLoading(true);
        setError(null);
        
        try {
          const response = await fetch('http://localhost:3000/api/v1/auth/guest_sign_in',{
            method: "POST",
            headers:{
              'Content-Type': 'application/json',
            }
          });
      
          if (response.ok) {

            const accessToken = response.headers.get('access-token')
            const client = response.headers.get('client')
            const uid = response.headers.get('uid')
            if (accessToken && client && uid) {
              setAuthTokens({ accessToken, client, uid })
            }

            const userData = await response.json();
            const userInfo = userData.data;
      
            setUser(userInfo)
            setLoading(false);
            return true;
          } else {
            setError('ゲストログインに失敗しました')
            setLoading(false);
           return false;
          }
        } catch (error) {
          // 4. 失敗時の処理
          setError('ネットワークエラーが発生しました')
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
    }
  )
);