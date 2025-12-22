'use client'

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api'
import { User } from '@/types/common';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Link from 'next/link';


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
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>ユーザー一覧</h1>

      {/* ユーザーリスト */}
      <div className='space-y-4'>
        {users.map((user) => {
          return(
            <div key={user.id} className='bg-white  rounded-lg p-4 hover:bg-gray-50 transition-colors'>
              <Link href={`users/${user.id}`}>
                <div className='flex items-center gap-4'>
                  <Image
                  src={user.imageUrl || "/images/default-avatar.png"}
                  alt={user.name}
                  width={48}
                  height={48}
                  className='w-12 h-12 rounded-full object-cover'
                  />
                  <span className="text-lg font-medium text-gray-900">{user.name}</span>
                </div>
              </Link>
            </div>

          )
        })}
      </div>
    </div>
  );
}