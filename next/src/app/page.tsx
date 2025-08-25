'use client';

import { useAuth } from '@/contexts/AuthContext';
import { WelcomePage } from '@/components/WelcomePage';
import { DashboardPage } from '@/components/DashboardPage';

export default function HomePage() {
  const { user, loading } = useAuth(); // loading を使用
  
  // 認証状態の確認中（ローディング中）
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  // 認証状態に応じてコンポーネントを切り替え
  return user ? <DashboardPage /> : <WelcomePage />;
}