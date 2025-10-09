// next/src/app/sign-up/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

interface FormData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export default function SignUpPage() {
  // 認証情報を取得
  const { signUp, loading, error, isLoggedIn, user } = useAuthStore();
  const router = useRouter();

  // フォームの設定
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();

  // パスワード確認用
  const password = watch('password');

  // 既にログインしている場合は自分のユーザーページに移動
  useEffect(() => {
    if (isLoggedIn && user) {
      router.push(`/users/${user.id}`);
    }
  }, [isLoggedIn, user, router]);

  // フォームが送信された時の処理
  const onSubmit = async (data: FormData) => {
    const success = await signUp(data.name, data.email, data.password);
    if (success && user) {
      router.push(`/users/${user.id}`); // サインアップ成功時は自分のユーザーページに移動
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">サインアップ</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* ユーザー名入力 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            ユーザー名
          </label>
          <input
            {...register('name', {
              required: 'ユーザー名を入力してください',
              minLength: {
                value: 2,
                message: 'ユーザー名は2文字以上で入力してください'
              }
            })}
            type="text"
            className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            placeholder="ユーザー名"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

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

        {/* パスワード確認入力 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            パスワード確認
          </label>
          <input
            {...register('passwordConfirmation', {
              required: 'パスワード確認を入力してください',
              validate: (value) => 
                value === password || 'パスワードが一致しません'
            })}
            type="password"
            className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            placeholder="パスワード確認"
          />
          {errors.passwordConfirmation && (
            <p className="text-red-500 text-sm mt-1">{errors.passwordConfirmation.message}</p>
          )}
        </div>

        {/* エラーメッセージ表示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* サインアップボタン */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'サインアップ中...' : 'サインアップ'}
        </button>
      </form>

      {/* サインインリンク */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          既にアカウントをお持ちの方は{' '}
          <Link href="/auth/sign-in" className="text-blue-500 hover:text-blue-700">
            サインイン
          </Link>
        </p>
      </div>
    </>
  );
}