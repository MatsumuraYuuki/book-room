'use client';

import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ReaderControls from './_components/ReaderControls';
import ReaderContent from './_components/ReaderContent';

interface AozoraBookContent {
  title: string;
  author: string;
  content: string;
}

export default function ReaderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // 本文を取得するAPI
  const { data: bookContent, isLoading, error } = useQuery<AozoraBookContent>({
    queryKey: ["aozorabook_content", id],
    queryFn: async () => {
      const response = await api.get(`/aozora_books/${id}/content`);
      return response.data
    },
    enabled: !!id
  });

  if (isLoading) {
    return <LoadingSpinner message="読み込み中..." />;
  };

  if (error) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <div className='text-xl text-red-600 mb-4'>
          本文の取得に失敗しました
        </div>
        <button
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          onClick={() => router.back()}
        >
          戻る
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <ReaderControls
        fontSize={fontSize}
        setFontSize={setFontSize}
        theme={theme}
        setTheme={setTheme}
        onBack={() => router.back()}
      />
      <ReaderContent
        bookContent={bookContent}
        fontSize={fontSize}
        theme={theme}
      />
    </div>
  );
}
