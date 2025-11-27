'use client';

import { useState, useEffect } from "react";
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { IoStatsChart, IoBook, IoCheckmarkDoneCircle } from 'react-icons/io5';
import { api } from '@/lib/api';
import { User, Bookshelf } from '@/types/common';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ReadingStatsChart from './_components/ReadingStatsChart';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/current/user');
        setUser(response.data)
      } catch (error) {
        console.error('取得失敗:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    }
    fetchUser()
  }, []);

  // 本棚データを取得
  const { data: bookshelves = [], isLoading: isBookshelvesLoading } = useQuery<Bookshelf[]>({
    queryKey: ['bookshelves'],
    queryFn: async () => {
      const response = await api.get("bookshelves");
      return response.data
    }
  });

  // 統計情報を計算
  const totalCount = bookshelves.length;
  const unreadCount = bookshelves.filter(b => b.status === 'unread').length;
  const readingCount = bookshelves.filter(b => b.status === 'reading').length;
  const completedCount = bookshelves.filter(b => b.status === 'completed').length;

  // 読書中の本
  const readingBooks = bookshelves.filter(b => b.status === 'reading');

  // 最近読了した本（updatedAtで降順ソート、最大5冊）
  const recentCompletedBooks = bookshelves
    .filter(b => b.status === 'completed')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  if (loading || isBookshelvesLoading) return <LoadingSpinner message="読み込み中..." />;
  if (!user) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* ヘッダー部分 */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
              <Image
                className="w-24 h-24 object-cover rounded-full"
                src={user?.imageUrl || "/default-avatar.png"}
                alt={user.name || "ユーザー"}
                width={96}
                height={96}
                priority
              />            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="px-4 py-2 rounded-md text-gray-600 font-bold hover:bg-gray-100 transition"
          >
            プロフィール編集
          </Link>
        </div>
      </div>

      {/* 統計情報カード */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <IoStatsChart className="text-blue-600" /> 読書統計
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ドーナツグラフ */}
          <div>
            <ReadingStatsChart
              totalCount={totalCount}
              unreadCount={unreadCount}
              readingCount={readingCount}
              completedCount={completedCount}
            />
          </div>
          {/* 数値表示 */}
          <div className="flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">登録数</span>
              <span className="text-2xl font-bold text-gray-900">{totalCount}冊</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-gray-700 font-medium">未読</span>
              </div>
              <span className="text-xl font-bold text-gray-400">{unreadCount}冊</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-gray-700 font-medium">読書中</span>
              </div>
              <span className="text-xl font-bold text-blue-600">{readingCount}冊</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="text-gray-700 font-medium">読了</span>
              </div>
              <span className="text-xl font-bold text-green-600">{completedCount}冊</span>
            </div>
          </div>
        </div>
      </div>

      {/* 読書中の本 */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <IoBook className="text-blue-600" /> 読書中の本
        </h2>
        {readingBooks.length === 0 ? (
          <p className="text-gray-500">読書中の本はありません</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {readingBooks.map((bookshelf) => (
              <li key={bookshelf.id} className="py-3">
                <Link href={`/reader/${bookshelf.id}`} className="block hover:bg-gray-50 transition p-2 rounded">
                  <h3 className="font-semibold text-gray-900">{bookshelf.aozoraBook.title}</h3>
                  <p className="text-sm text-gray-600">{bookshelf.aozoraBook.author}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 最近読了した本 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <IoCheckmarkDoneCircle className="text-green-600" /> 最近読了した本
        </h2>
        {recentCompletedBooks.length === 0 ? (
          <p className="text-gray-500">読了した本はありません</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentCompletedBooks.map((bookshelf) => (
              <li key={bookshelf.id} className="py-3">
                <Link href={`/reader/${bookshelf.id}`} className="block hover:bg-gray-50 transition p-2 rounded">
                  <h3 className="font-semibold text-gray-900">{bookshelf.aozoraBook.title}</h3>
                  <p className="text-sm text-gray-600">{bookshelf.aozoraBook.author}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    更新日: {new Date(bookshelf.updatedAt).toLocaleDateString('ja-JP')}
                  </p>
                </Link>
              </li>
            ))}
          </ul>        )}
      </div>
    </div>
  );
}