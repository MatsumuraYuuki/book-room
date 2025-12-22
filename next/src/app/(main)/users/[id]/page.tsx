'use client';

import { useState, useEffect } from "react";
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User, Bookshelf } from '@/types/common';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import BookshelfCard from '@/components/features/bookshelf/BookshelfCard';
import BookshelfStats from '@/components/features/bookshelf/BookshelfStats';
import BookshelfControls from '@/components/features/bookshelf/BookshelfControls';

type Props = {
  params: { id: string }
}

export default function UserPage({ params }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // フィルター用のstate
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unread' | 'reading' | 'completed'>("all");

  // ソート用のstate
  const [selectedSort, setSelectedSort] = useState<'newest' | 'oldest'>("newest");

  // URL「users/1ああ」でもID1のページが表示されてしまうエラー対処。IDが数値のみかチェック
  useEffect(() => {
    if (!/^\d+$/.test(params.id)) {
      notFound(); // 404ページにリダイレクト
    }
  }, [params.id]);

  // ユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${params.id}`);
        setUser(response.data)
      } catch (error) {
        console.error('取得失敗:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    }
    fetchUser()
  }, [params.id]);

  // ユーザーの本棚を取得
  const { data: bookshelves = [], isLoading: isBookshelfLoading } = useQuery<Bookshelf[]>({
    queryKey: ['bookshelves', params.id],
    queryFn: async () => {
      const response = await api.get(`/bookshelves?user_id=${params.id}`);
      return response.data
    },
    enabled: !loading && !!user // ユーザー情報が取得できてから実行
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

  if (loading) {
    return <LoadingSpinner message="読み込み中..." />
  }
  if (!user) return notFound();

  return (
    <div className="container mx-auto px-2 py-4">
      {/* ユーザー情報・統計の表示 */}
      <div className='mb-6 bg-white shadow rounded-lg p-6'>
        <div className='flex items-start gap-6'>
          <Image
            src={user.imageUrl || "/default-avatar.png"}
            alt={user.name || "ユーザー"}
            className='w-24 h-24 rounded-full object-cover'
            width={96}
            height={96}
            priority
          />
          <div className='flex-1'>
            <h2 className='text-2xl font-bold mb-2'>{user.name}の本棚</h2>

            {/* 統計情報表示(横並び) */}
            {isBookshelfLoading ? (
              <p className="text-gray-500 text-sm">統計情報を読み込み中...</p>
            ) : (
              <BookshelfStats
                totalCount={totalCount}
                unreadCount={unreadCount}
                readingCount={readingCount}
                completedCount={completedCount}
              />
            )}
          </div>
        </div>
      </div>

      {/* 本棚セクション */}
      {isBookshelfLoading ? (
        <LoadingSpinner message="本棚を読み込み中..." />
      ) : (
        <>
          {/* フィルターボタン */}
          <BookshelfControls
            selectedStatus={selectedStatus}
            selectedSort={selectedSort}
            onStatusChange={setSelectedStatus}
            onSortChange={setSelectedSort}
          />

          {/* 本棚登録数が0の時 */}
          {bookshelves.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              <p>まだ本棚に本がありません</p>
            </div>
          )}

          {/* 取得した本棚を表示 */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:grid-cols-4'>
            {sortedBookshelves.map(bookshelf => (
              <BookshelfCard
                key={bookshelf.id}
                bookshelf={bookshelf}
                onClick={() => {}} // 他のユーザーの本棚はクリック無効
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
