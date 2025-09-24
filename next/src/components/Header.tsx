// next/src/components/Header.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export const Header = () => {
  // 認証情報を取得
  const { user, isLoggedIn, signOut } = useAuth();
  const router = useRouter();

  // サインアウトボタンがクリックされた時の処理
  const handleSignOut = () => {
    signOut();           // サインアウト実行
    router.push('/');    // ホームページに移動
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* ロゴ */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                BookRoom
              </Link>
            </div>

            {/* メニュー */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                ホーム
              </Link>
              <Link href="/articles" className="text-gray-600 hover:text-gray-900">
                記事一覧
              </Link>
              <Link href="/auth-test" className="text-gray-600 hover:text-gray-900">
                認証テスト
              </Link>            
            </nav>

            {/* ユーザーメニュー */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                // ログイン中の場合
                <>
                  <span className="text-sm text-gray-600">
                    こんにちは、{user?.name}さん
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    サインアウト
                  </button>
                </>
              ) : (
                // ログインしていない場合
                <>
                  <Link
                    href="/auth/sign-in"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    サインイン
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    サインアップ
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};