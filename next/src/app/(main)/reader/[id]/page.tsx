'use client';

import { useState } from 'react';
import { BsSun, BsMoonStars } from 'react-icons/bs';
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface AozoraBookContent {
  title: string;
  author: string;
  content: string;
}

export default function ReaderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;  // このidをuseQueryで使う

  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium")
  const fontSizeClasses = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl"
  }

  const [theme, setTheme] = useState<"light" | "dark">("light")
  const themeClasses = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900'
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-gray-200'
    }
  }


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
      {/* Sticky Header: コントロールパネル + 戻るボタン */}
      <div className={`sticky top-0 z-10 shadow-md ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-full mx-auto px-4 py-4">
          <div className='flex justify-between items-center'>
            {/* コントロールパネル */}
            <div className='flex gap-4 items-center'>
              {/* フォントサイズ変更 */}
              <div className='flex gap-2'>
                <button
                  onClick={() => setFontSize('small')}
                  className={`px-3 py-1 rounded ${fontSize === "small" ? "bg-blue-500 text-white" : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  小
                </button>

                <button
                  onClick={() => setFontSize('medium')}
                  className={`px-3 py-1 rounded ${fontSize === "medium" ? "bg-blue-500 text-white" : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  中
                </button>

                <button
                  onClick={() => setFontSize('large')}
                  className={`px-3 py-1 rounded ${fontSize === "large" ? "bg-blue-500 text-white" : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  大
                </button>
              </div>

              {/* カラー変更（トグルスイッチ） */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={`inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                aria-label="テーマ切り替え"
              >
                {/* スライダー（アイコン入り） */}
                <span
                  className={`inline-flex items-center justify-center h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200 ${theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
                    }`}
                >
                  {theme === 'light' ? (
                    <BsSun className="w-3.5 h-3.5 text-yellow-500" />
                  ) : (
                    <BsMoonStars className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </span>
              </button>
            </div>

            {/* 戻るボタン */}
            <button
              className='px-3 py-2 bg-gray-500 font-semibold text-white rounded hover:bg-gray-600'
              onClick={() => router.back()}
            >
              戻る
            </button>
          </div>
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className='max-w-full mx-auto px-4 py-4'>
        {/* ヘッダー（タイトル・著者） */}
        <div className={`mb-6 p-4 rounded-lg ${themeClasses[theme].bg}`}>
          <h1 className={`text-2xl font-bold ${themeClasses[theme].text}`}>{bookContent?.title}</h1>
          <p className={`${theme === "dark" ? 'text-gray-400' : 'text-gray-600'}`}>{bookContent?.author}</p>
        </div>

        {/* 本文エリア */}
        <div className={`shadow-md rounded-lg p-8 ${themeClasses[theme].bg}`}>
          <div
            className={`prose max-w-none ${fontSizeClasses[fontSize]} ${themeClasses[theme].text}`}
            dangerouslySetInnerHTML={{
              __html: bookContent?.content || ""
            }}
          >
          </div>
        </div>
      </div>

    </div>
  );
}
