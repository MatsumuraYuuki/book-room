'use client';

import { useMutation } from "@tanstack/react-query";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import Pagination from '@/components/common/Pagination';
import { AozoraBook, MetaProps } from '@/types/common';
import SearchResultItem from './_components/SearchResultItem';
import { useState, useEffect } from "react";

interface SearchResponse {
  data: AozoraBook[];
  meta: MetaProps;
}

interface SearchFormData {
  keyword: string;
}

export default function SearchPage() {
  const [showLoading, setShowLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SearchFormData>();
  const searchParams = useSearchParams()
  const router = useRouter()

  // useMutation関数の【呼び出し】＋ 型をジェネリクスで指定　
  const mutation = useMutation<SearchResponse, Error, { keyword: string, page: number }>({
    mutationFn: async ({ keyword, page }) => {
      const response = await api.get(`aozora_books?keyword=${keyword}&page=${page}`)
      return response.data;
    }
  })

  // フォーム送信処理
  const onSubmit = (data: SearchFormData) => {
    router.push(`/search?keyword=${data.keyword}&page=1`)
  };

  useEffect(() => {
    const keyword = searchParams.get("keyword")
    const page = searchParams.get("page") || "1"
    if (keyword) {
      mutation.mutate({ keyword, page: Number(page) }) //引数のpageは文字列なのでint形式に変更
      reset({ keyword: keyword })  // フォームの値をリセット（更新）
    }
  }, [searchParams, reset]) // eslint-disable-line react-hooks/exhaustive-deps

  // ロード時間が1秒以上の時howLoadingがtrueになる
  useEffect(() => {
    if (mutation.isPending) {
      // 1秒後にローディング表示フラグを立てる
      const timer = setTimeout(() => {
        setShowLoading(true)
      }, 1000)
      // クリーンアップ（タイマー解除）
      return () => clearTimeout(timer)
    } else {
      // 読み込み完了したらフラグを下ろす
      setShowLoading(false)
    }
  }, [mutation.isPending])

  return (
    <div className="max-w-2xl mx-auto px-8">
      <h1 className="text-3xl font-bold mb-6">作品を検索</h1>
      <p className="text-sm text-gray-600 mb-2">
        作品名、著者名を入力して検索してください。<br />
        例えば… 夏目漱石 や 羅生門 や ドストエフスキー など。<br />
        複数検索する場合、間にはスペースを入れるようにしてください。
      </p>

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <div>
          <div className="relative">
            <input
              id="search"
              {...register('keyword', { required: '作品名または作者名を入力してください' })}
              className="border border-gray-300 rounded px-2 py-2 w-full"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <MagnifyingGlassIcon className="h-7 w-7 text-blue-600" />
            </button>
          </div>
          {errors.keyword && <p className="text-red-500">{errors.keyword.message}</p>}
        </div>
      </form>

      {/* 検索結果 */}
      <div className="mt-6 space-y-0">
        {mutation.data?.meta && (
          <div className="mb-2 text-gray-700">
            検索結果: {mutation.data.meta.totalCount}件
          </div>
        )}

        {/* 検索中の表示 */}
        {showLoading && mutation.isPending && (
          <div className="text-center py-8 text-gray-600">検索中...</div>
        )}

        {/* エラー時の表示 */}
        {mutation.isError && (
          <div className="text-center py-8 text-gray-600">エラーが発生しました</div>
        )}

        {/* 検索結果が0の時の表示 */}
        {mutation.data?.data && mutation.data.data.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <p>検索結果が見つかりませんでした</p>
            <p className="text-sm mt-2">別のキーワードで検索してみてください</p>
          </div>
        )}

        {/* 検索結果の表示 */}
        {mutation.data?.data && mutation.data?.data.map((aozoraBook, index) => (
          <SearchResultItem
            key={aozoraBook.id}
            aozoraBook={aozoraBook}
            isLast={index === mutation.data.data.length - 1}
          />
        ))}
        {mutation.data?.meta && (
          <Pagination
            meta={mutation.data.meta}
            onPageChange={(event) => {
              const keyword = searchParams.get("keyword")
              router.push(`/search?keyword=${keyword}&page=${event.selected + 1}`)
            }}
          />
        )}
      </div>
    </div>
  );
}