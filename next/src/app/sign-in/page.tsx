// next/src/app/sign-in/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

interface FormData {
  email: string;
  password: string;
}

export default function SignInPage() {
  // 認証情報を取得
  const { signIn, loading, error, isLoggedIn } = useAuth();
  const router = useRouter();

  // フォームの設定
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  // 既にログインしている場合はホームに移動
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  // フォームが送信された時の処理
  const onSubmit = async (data: FormData) => {
    const success = await signIn(data.email, data.password);
    if (success) {
      router.push('/'); // サインイン成功時はホームに移動
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">サインイン</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* メールアドレス入力 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              メールアドレス
            </label>
            <input
              {...register('email', {
                required: 'メールアドレスを入力してください',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '正しいメールアドレスを入力してください'
                }
              })}
              type="email"
              className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* パスワード入力 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              パスワード
            </label>
            <input
              {...register('password', {
                required: 'パスワードを入力してください',
                minLength: {
                  value: 6,
                  message: 'パスワードは6文字以上で入力してください'
                }
              })}
              type="password"
              className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              placeholder="パスワード"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* エラーメッセージ表示 */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* サインインボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'サインイン中...' : 'サインイン'}
          </button>
        </form>

        {/* サインアップリンク */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            アカウントをお持ちでない方は{' '}
            <Link href="/sign-up" className="text-blue-500 hover:text-blue-700">
              サインアップ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}