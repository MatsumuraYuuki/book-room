'use client';

import { useState, useEffect } from "react";
import { api } from '@/utils/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';



type User = {
  name: string,
  email: string,
  id: number,
  image_url?: string
}

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

  if (loading) return <div>読み込み中...</div>;
  if (!user) return notFound(); 

  return (
    <div>
      <h1>プロフィール</h1>
      <p>ユーザー名: {user.name}</p>
      <Image
      className="w-24 h-24 object-cover rounded-full"
      src={user.image_url || "/default-avatar.png" }
      alt={user.name}
      width={100}
      height={100}
      />
      <p>メールアドレス: {user.email}</p> 

      
      <div>
        <Link href="/profile/edit">プロフィール編集</Link>
      </div>
      

      <div>
        <h2>本棚</h2>
        <p>（本棚は後で実装予定）</p>
      </div>      
    </div>
  );
}