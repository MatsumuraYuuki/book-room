'use client';

import { useMutation } from "@tanstack/react-query";
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { AozoraBook } from '@/types/common';
import AddToBookshelfDropdown from '@/components/features/AddToBookshelfDropdown';

interface SearchFormData {
  keyword: string;
}


export default function SearchPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormData>();

  // 型をジェネリクスで指定
  const mutation = useMutation<AozoraBook[], Error, string>({
    mutationFn: async (keyword: string) => {
      const response = await api.get(`aozora_books?keyword=${keyword}`)
      return response.data;
    }
  })

  // フォーム送信処理
  const onSubmit = (data: SearchFormData) => {
    // .mutate()を呼ぶと、mutationFnが実行される
    mutation.mutate(data.keyword)
  };

  // 取得中の表示 / Query（useMutation使用）
  if (mutation.isPending) {
    return <div>検索中...</div>;
  }
  // エラー時の表示 / Query（useMutation使用）
  if (mutation.isError) {
    return <div>エラーが発生しました</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">作品を検索</h1>
      {/* 入力フォーム */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* 作品名・作者名の入力フィールド */}
        <div>
          <label htmlFor="search">作品名・作者名</label>
          <input
            type="search"
            id="search"
            {...register('keyword', { required: '作品名または作者名を入力してください' })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          {/* エラーメッセージ表示 */}
          {errors.keyword && <p className="text-red-500">{errors.keyword.message}</p>}

        </div>
        {/* 送信ボタン */}
        <button type="submit" className="border border-black">検索</button>
      </form>

      {/* 検索結果 */}
      <div>
        {mutation.data && mutation.data.map((book) => (
          <div key={book.aozoraBookId}>
            <p>{book.title}</p>
            <p>{book.author}</p>
            <a
              href={book.aozoraCardUrl}
              target="_balank"
              rel="noopener noreferrer"
            > 詳細を見る</a>
            <AddToBookshelfDropdown aozoraBookId={book.id}/>
          </div>
        ))}
      </div>
    </div>
  );
}
