"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Navigation } from '@/components/common/Navigation';

// (main)以下はナビゲーションバーを無効化
// readerページの場合一部レイアウトを変更
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  
  const router = useRouter();
  const pathname = usePathname();
  const isReaderPage = pathname?.startsWith('/reader');  // readerページかどうか

  // 認証していない場合ホームページに遷移する
  useEffect(() => {
    if (!hasHydrated) return;

    if (!user) {
      // ログアウト時はホームページにリダイレクト
      router.push('/');
    }
  },[user, router, hasHydrated])
  
  if (!hasHydrated) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen ${!isReaderPage ? 'bg-white' : ''}`}>
      {/* readerページではNavigationを表示しない */}
      {!isReaderPage && <Navigation />}

      <main className={`flex flex-col min-h-screen ${!isReaderPage ? 'md:pl-64 pt-16' : ''
        }`}>
        <div className={`flex-1 ${!isReaderPage ? 'p-4 md:p-8' : ''}`}>
          {children}
        </div>

        {/* モバイル用の下部余白readerページでは下部余白も不要  */}
        {!isReaderPage && <div className="h-20 md:h-0"></div>}
      </main>
    </div>

  )
}