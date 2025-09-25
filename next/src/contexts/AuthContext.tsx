// next/src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// ユーザーの型定義
interface User {
  id: number;
  name: string;
  email: string;
}

// 認証コンテキストの型定義
interface AuthContextType {
  user: User | null;           // ユーザー情報（ログインしていない場合はnull）
  isLoggedIn: boolean;         // ログイン状態
  loading: boolean;            // 読み込み中かどうか
  error: string | null;        // エラーメッセージ
  // signInは関数である。Promiseを使い「待機可能な型」を定義する（実際に待たせる処理をするのはawait演算子）
  signIn: (email: string, password: string) => Promise<boolean>;
  guestSignIn: () => Promise<boolean>; // ゲストログイン用
  signUp: (name: string, email: string, password: string) => Promise<boolean>; // 追加
  signOut: () => void;         // void「何も返さない」という意味の型
}

// コンテキストを作成 「認証情報を入れる専用の箱」を作成
// AuthContext.Providerはここで自動作成される
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProviderは「箱に入れる手紙を作成・管理する」役割
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // 手紙を書くための材料（状態管理）useStateが値を変更する道具
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // リロードまたはブラウザを閉じて再度開き、'user'がローカルストレージには残っているがstateはクリアされてしまった時に使われる
  const getUserFromStorage = () => {
    if (typeof window === 'undefined') return null;

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  };

  // ローカルストレージにユーザー情報を保存
  const saveUserToStorage = (userData: User) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // ローカルストレージからユーザー情報を削除
  const removeUserFromStorage = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user');
  };

  // サインイン機能
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);  // 読み込み開始
    setError(null);    // エラーをリセット

    try {
      // APIにサインインリクエストを送信
      const response = await fetch('http://localhost:3000/api/v1/auth/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        // サインイン成功
        const userData = await response.json();
        const userInfo = userData.data;

        // ステートを更新　アプリ全体でログインしたユーザーとして機能
        setUser(userInfo);
        setIsLoggedIn(true);
        setError(null);

        // ローカルストレージに保存
        saveUserToStorage(userInfo);

        setLoading(false);
        return true;
      } else {
        // サインイン失敗
        setError('メールアドレスまたはパスワードが間違っています');
        setLoading(false);
        return false;
      }
    } catch (err) {
      // ネットワークエラーなど
      setError('ネットワークエラーが発生しました');
      setLoading(false);
      return false;
    }
  };

  // サインアップ機能
  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);  // 読み込み開始
    setError(null);    // エラーをリセット

    try {
      const requestBody = {
        registration: {     // registrationラッパーを追加
          name,
          email,
          password,
          password_confirmation: password
        }
      };

      // Next.jsがRailsに送信＋受信（DeviseTokenAuth用）
      const response = await fetch('http://localhost:3000/api/v1/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        // サインアップ成功
        const userData = await response.json(); // 受信したレスポンスをJSON形式に変換
        const userInfo = userData.data; // DeviseTokenAuthのレスポンスのdataプロパティからユーザー情報を取得

        // ステートを更新　アプリ全体でログインしたユーザーとして機能
        setUser(userInfo);
        setIsLoggedIn(true);
        setError(null);

        // ローカルストレージに保存
        saveUserToStorage(userInfo);

        setLoading(false);
        return true;
      } else {
        // サインアップ失敗
        const errorData = await response.json();
        setError(errorData.errors?.full_messages?.[0] || 'サインアップに失敗しました');
        setLoading(false);
        return false;
      }
    } catch (err) {
      // ネットワークエラーなど
      setError('ネットワークエラーが発生しました');
      setLoading(false);
      return false;
    }
  };

  // サインアウト機能
  const signOut = () => {
    setUser(null);           // ユーザー情報をクリア
    setIsLoggedIn(false);    // ログイン状態をfalseに
    setError(null);          // エラーをクリア
    removeUserFromStorage(); // ローカルストレージからも削除
  };

  // ページが読み込まれた時に実行される（初期化処理）
  // リロードまたはブラウザを閉じて再度開くとローカルストレージには残っているがstateがクリアされる
  useEffect(() => {
    const savedUser = getUserFromStorage();
    if (savedUser) {
      setUser(savedUser);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const guestSignIn = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // ゲストログインAPIを呼び出し
      const response = await fetch('http://localhost:3000/api/v1/auth/guest_sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        // ゲストログイン成功
        const userData = await response.json();
        const userInfo = userData.data;

        // 通常ログインと同じ処理
        setUser(userInfo);
        setIsLoggedIn(true);
        setError(null);

        // ローカルストレージに保存
        saveUserToStorage(userInfo);

        setLoading(false);
        return true;
      } else {
        setError('ゲストログインに失敗しました');
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
      setLoading(false);
      return false;
    }
  };



  // グローバルステートは何を渡している？→ 「このvalueを渡している」
  const value = {
    user,
    isLoggedIn,
    loading,
    error,
    signIn,
    signUp, // 追加済み
    signOut,
    guestSignIn
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuthはconst { signIn } = useAuth();という感じで別のpage.tsxでAuthContextの関数や状態を呼び出すためのメソッド
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthはAuthProviderの中で使用してください');
  }
  return context;
};