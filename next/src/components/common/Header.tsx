// next/src/components/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore'
import { useRouter, usePathname } from 'next/navigation';

export const Header = () => {
  // readerページの判定
  const pathname = usePathname();
  const isReaderPage = pathname?.startsWith('/reader');

  // 認証情報を取得
  const { user, isLoggedIn, signOut } = useAuthStore();
  const router = useRouter();

  // サインアウトボタンがクリックされた時の処理
  const handleSignOut = () => {
    signOut();           // サインアウト実行
    router.push('/');    // ホームページに移動
  };

  // readerページではheaderを表示しない
  if (isReaderPage) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[60] bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* ロゴ */}
            <Link  href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <Image 
                src="/images/logo.png" 
                alt="Aozora Library" 
                width={40} 
                height={40}
              />     
              <div className="h-8 w-px bg-gray-300"></div>         
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Aozora Library
              </span>
            </Link>

            {/* メニュー */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                ホーム
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