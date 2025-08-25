// next/src/app/search/page.tsx
'use client';

import { Navigation } from '@/components/Navigation';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="md:pl-64 flex flex-col min-h-screen">
        <div className="flex-1 p-4 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900">本を探す</h1>
          <p className="text-gray-600 mt-2">本検索機能を準備中です</p>
        </div>
        
        <div className="h-20 md:h-0"></div>
      </main>
    </div>
  );
}