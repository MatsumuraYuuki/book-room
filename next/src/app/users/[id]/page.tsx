'use client';

import { useState, useEffect } from "react";
import axios from 'axios';
import Link from 'next/link';
import { useAuthStore } from "@/stores/authStore";
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string }
}

type User = {
  name: string,
  email: string,
  id: number
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
        const response = await axios.get(`http://localhost:3000/api/v1/users/${params.id}`);
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
    <div>
      <h1>プロフィール</h1>
      <p>ユーザー名: {user.name}</p>
      <p>メールアドレス: {user.email}</p> 

      {isOwnProfile && (
        <div>
          <Link href="/edit/profile">プロフィール編集</Link>
        </div>
      )}

      <div>
        <h2>本棚</h2>
        <p>（本棚は後で実装予定）</p>
      </div>      
    </div>
  );
}