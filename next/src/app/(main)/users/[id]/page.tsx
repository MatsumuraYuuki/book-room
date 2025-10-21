'use client';

import { useState, useEffect } from "react";
import axios from 'axios';
import Link from 'next/link';
import { useAuthStore } from "@/stores/authStore";
import { notFound } from 'next/navigation';
import Image from 'next/image';

type Props = {
  params: { id: string }
}

type User = {
  name: string,
  email: string,
  id: number,
  image_url?: string
}

export default function UserPage({ params }: Props) {
  const { user: currentUser, isLoggedIn } = useAuthStore()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // URL「users/1ああ」でもID1のページが表示されてしまうエラー対処。IDが数値のみかチェック
  useEffect(() => {
    if (!/^\d+$/.test(params.id)) {
      notFound(); // 404ページにリダイレクト
    }
  }, [params.id]);
  
  const isOwnProfile = isLoggedIn && currentUser?.id === parseInt(params.id);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${params.id}`);
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

  if (loading) return <div>読み込み中...</div>;
  if (!user) return notFound();

  return (
    <div className="max-w-4xl mx-auto">
      {/* ヘッダー部分 */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-6">
          <Image
            className="w-24 h-24 object-cover rounded-full"
            src={user.image_url || "/default-avatar.png"}
            alt={user.name}
            width={96}
            height={96}
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            {isOwnProfile && (
              <Link
                href="/profile/edit"
                className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                プロフィール編集
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 本棚セクション */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">本棚</h2>
        <p className="text-gray-500">（本棚は後で実装予定）</p>
      </div>
    </div>
  );
}