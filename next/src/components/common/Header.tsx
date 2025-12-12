// next/src/components/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore'
import { useRouter, usePathname } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';

export const Header = () => {
  // 現在のページパスを取得
  const pathname = usePathname();
  const isReaderPage = pathname?.startsWith('/reader');
  const isHomePage = pathname === '/';

  // 認証情報を取得
  const { isLoggedIn, signOut } = useAuthStore();
  const router = useRouter();

  // サインアウトボタンがクリックされた時の処理
  const handleSignOut = () => {
    signOut();
    router.push('/');
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
            
            {/* 左側：ロゴ */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
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

            {/* 右側：ユーザーメニュー */}
            <div className="flex items-center space-x-4">
              {isHomePage ? (
                // ホームページ：サインイン・サインアップボタン
                !isLoggedIn && (
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
                )
              ) : (
                // サインアウトページ
                isLoggedIn && (
                  <>
                    <div className="relative group">
                      <button
                        onClick={handleSignOut}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        aria-label="ログアウト"
                      >
                        <FiLogOut size={20} />
                      </button>
                      {/* ツールチップ */}
                      <div className="absolute right-0 top-full mt-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                        ログアウトする
                        {/* 三角形の矢印 */}
                        <div className="absolute bottom-full right-4 border-4 border-transparent border-b-gray-800"></div>
                      </div>
                    </div>                  
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};