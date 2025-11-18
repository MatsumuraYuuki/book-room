'use client'

import Image from 'next/image';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api'
import { Bookshelf } from '@/types/common';
import BookshelfCard from '@/app/(main)/my-books/_components/BookshelfCard';
import BookshelfStats from './_components/BookshelfStats';
import BookshelfControls from './_components/BookshelfControls';

export default function BookshelfPage() {
  const user = useAuthStore((state) => state.user)

  // フィルター用のstate（'all' | 'unread' | 'reading' | 'completed'）
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unread' | 'reading' | 'completed'>("all");
  
  // ソート用のstate(本棚追加日が　新しい順 | 古い順)
  const [selectedSort, setSelectedSort] = useState<'newest' | 'oldest'>("newest");




  // ユーザーが本棚に追加している本を取得
  const { data: bookshelves = [], isLoading, isError } = useQuery<Bookshelf[]>({
    queryKey: ['bookshelves'],
    queryFn: async () => {
      const response = await api.get("bookshelves");
      return response.data
    }
  });

  // 登録されている冊数を計算
  const totalCount = bookshelves.length
  const unreadCount = bookshelves.filter(b => b.status === 'unread').length
  const readingCount = bookshelves.filter(b => b.status === 'reading').length
  const completedCount = bookshelves.filter(b => b.status === 'completed').length

  // フィルタリング
  const filteredBookshelves = selectedStatus === "all"
    ? bookshelves
    : bookshelves.filter(b => b.status === selectedStatus);

  // 本棚登録日順でソート
  const sortedBookshelves = [...filteredBookshelves].sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)

    if (selectedSort === "newest") {
      return dateB.getTime() - dateA.getTime()
    } else {
      return dateA.getTime() - dateB.getTime()
    }
  })


  if (isLoading) {
    return <div className='text-center py-8 text-gray-600'>検索中...</div>
  }

  if (isError) {
    return <div className='text-center py-8 text-gray-600'>エラーが発生しました</div>
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* 本棚登録数が0の時 */}
      {bookshelves && bookshelves.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <p>まだ本棚に本がありません</p>
          <p className="text-sm mt-2">検索ページから本を登録しましょう！</p>
        </div>
      )}

      {/* ユーザー情報・統計の表示 */}
      <div className='mb-6 bg-white shadow rounded-lg p-6'>
        <div className='flex items-start gap-6'>
          <Image
            src={user?.imageUrl || "/default-avatar.png"}
            alt={user?.name || "ユーザー"}
            className='w-24 h-24 rounded-full object-cover'
            width={96}
            height={96}
          />
          <div className='flex-1'>
            <h2 className='text-2xl font-bold mb-2'>{user?.name}の本棚</h2>

            {/* 統計情報表示(横並び) */}
            <BookshelfStats
              totalCount={totalCount}
              unreadCount={unreadCount}
              readingCount={readingCount}
              completedCount={completedCount}
            />
          </div>
        </div>
      </div>

      {/* フィルターボタン */}
      <BookshelfControls
        selectedStatus={selectedStatus}
        selectedSort={selectedSort}
        onStatusChange={setSelectedStatus}
        onSortChange={setSelectedSort}
      />

      {/* 取得した本棚を表示 */}
      <div className='grid grid-cols-1  sm:grid-cols-2  md:grid-cols-2 lg:grid-cols-3 gap-4 xl:grid-cols-4'>
        {sortedBookshelves.map(bookshelf => (
          <BookshelfCard key={bookshelf.id} bookshelf={bookshelf} />
        ))}
      </div>
    </div>
  );
}
