'use client';

import { useAuth } from '@/contexts/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900">
        {user?.name}さん、ダッシュボードへようこそ！
      </h1>
    </div>
  );
}