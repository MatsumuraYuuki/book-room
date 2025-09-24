// next/src/components/Navigation.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  ClockIcon,      // タイムライン用
  MagnifyingGlassIcon  // 本を探す用
} from '@heroicons/react/24/outline';

// ナビゲーション項目の型定義
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;  //アイコンの型定義
}

// ナビゲーション項目の設定
const navItems: NavItem[] = [
  { name: 'タイムライン', href: '/timeline', icon: ClockIcon },
  { name: '本を探す', href: '/search', icon: MagnifyingGlassIcon },
];

export function Navigation() {
  const pathname = usePathname(); // 現在のパスを取得 usePathnameはNext.js標準機能

  return (
    <>
      {/* デスクトップ・タブレット用サイドバー（768px以上で表示） */}
      {/* aside = HTML5のセマンティック要素で「補助的なコンテンツ */}
      <aside className="hidden md:flex md:flex-col md:fixed md:top-16 md:bottom-0 md:z-50 md:w-64 md:bg-white">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {/* ナビゲーションメニュー */}
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              // アクティブ状態の判定
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' // アクティブ時のスタイル
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900' // 非アクティブ時のスタイル
                    }
                  `}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* モバイル用ボトムバー（767px以下で表示） */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            // アクティブ状態の判定
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex flex-col items-center px-3 py-2 text-xs font-medium rounded-md
                  ${isActive 
                    ? 'text-blue-500' // アクティブ時のスタイル
                    : 'text-gray-400 hover:text-white' // 非アクティブ時のスタイル
                  }
                `}
              >
                <item.icon className="h-6 w-6 mb-1" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}