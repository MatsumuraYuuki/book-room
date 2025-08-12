// next/src/hooks/useAuth.ts
import { useState } from 'react';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // サインイン関数
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    // try-catchの形
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        // 成功  setLoading(false)で処理完了したことになる
        setLoading(false);
        return true;
      } else {
        // 失敗
        setError('メールアドレスまたはパスワードが間違っています');
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
      setLoading(false);
      return false;
    }
  };

  return {
    signIn,
    loading,
    error
  };
};