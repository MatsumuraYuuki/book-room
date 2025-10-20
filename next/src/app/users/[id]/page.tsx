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
    <div>
      <h1>プロフィール</h1>
      <p>ユーザー名: {user.name}</p>
      <Image
      src={user.image_url || "/default-avatar.png" }
      alt="user.name"
      width={100}
      height={100
      }/>
      <p>メールアドレス: {user.email}</p> 

      {isOwnProfile && (
        <div>
          <Link href="/profile/edit">プロフィール編集</Link>
        </div>
      )}

      <div>
        <h2>本棚</h2>
        <p>（本棚は後で実装予定）</p>
      </div>      
    </div>
  );
}