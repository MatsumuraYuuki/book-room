'use client'

import Image from 'next/image';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api'
import { User } from '@/types/common';
import LoadingSpinner from '@/components/common/LoadingSpinner';


export default function UsersPage() {
 
  // ユーザー一覧を取得
  const { data: users = [], isLoading, isError } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get("/users");
      return response.data
    }
  });  


  if (isLoading) {
    return <LoadingSpinner message="検索中..." />
  }

  if (isError) {
    return <div className='text-center py-8 text-gray-600'>エラーが発生しました</div>
  }

  return (
    
    <>
      <h1 className="text-2xl font-bold mb-4">ユーザー一欄ページ</h1>
      <p>ここにユーザー一欄ページを表示します。</p>
    </>
  );
}