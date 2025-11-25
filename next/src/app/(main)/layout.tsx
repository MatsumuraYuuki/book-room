"use client"

import { Navigation } from '@/components/common/Navigation';
import { usePathname } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isReaderPage = pathname?.startsWith('/reader');  // readerページかどうか
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