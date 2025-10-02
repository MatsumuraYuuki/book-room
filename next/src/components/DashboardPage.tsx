// next/src/components/DashboardPage.tsx
'use client';

import { useAuthStore } from '@/stores/authStore'

export function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {user?.name}さん、ダッシュボードへようこそ！
        </h1>
        
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              🎉 ナビゲーションが実装されました！
            </h2>
            <p className="text-blue-800">
              左側のサイドバー（デスクトップ・タブレット）または下部のボトムバー（モバイル）から各機能にアクセスできます。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h3 className="font-semibold text-gray-900">タイムライン</h3>
              <p className="text-gray-600 text-sm mt-1">最新の記事をチェック</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h3 className="font-semibold text-gray-900">記事を書く</h3>
              <p className="text-gray-600 text-sm mt-1">新しい記事を投稿</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h3 className="font-semibold text-gray-900">本を探す</h3>
              <p className="text-gray-600 text-sm mt-1">読みたい本を発見</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}