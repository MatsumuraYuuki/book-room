// next/src/app/signin/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
}

export default function SignInPage() {
  // useAuth()実行結果の戻り値を分割代入{ }で受け取る
  const { signIn, loading, error } = useAuth();
    // ページ遷移を実行
  const router = useRouter();

  // <FormData> は TypeScript の型指定で、フォームのデータ型を指定
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  // (data)にはユーザーがフォームに入力した値が自動的に入ります。
  const onSubmit = async (data: FormData) => {
    const success = await signIn(data.email, data.password);
    if (success) {
      router.push('/'); // ホームページに移動
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">サインイン</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* メールアドレス */}
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

          {/* パスワード */}
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

          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* サインインボタン */}
          <button
            type="submit"
            disabled={loading}  // disabledはtrueの時にボタンが押せなくなる
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'サインイン中...' : 'サインイン'}
          </button>
        </form>
      </div>
    </div>
  );
}