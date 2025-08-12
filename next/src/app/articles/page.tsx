"use client";

import { useArticlesData } from '@/hooks/useArticlesData';
import { usePagination } from '@/hooks/usePagination';
import ArticleList from '@/app/articles/components/ArticleList'; 
import Pagination from '@/components/Pagination';

function LoadingState() {
  return <div className="text-center mt-8">Loading...</div>;
}

function ErrorState() {
  return <div>An error has occurred.</div>;
}

export default function ArticlesPage() {
  const { articles, meta, error, isLoading } = useArticlesData();
  const { handlePageChange } = usePagination();

  if (error) return <ErrorState />;
  if (isLoading) return <LoadingState />;
  if (!meta) return <ErrorState />;

  return (
    <div className="bg-blue-50 min-h-screen flex flex-col">
      <div className="container mx-auto max-w-4xl pt-6 px-4 flex-1 flex flex-col">
        {/* 記事一覧 */}
        <div>
          <ArticleList articles={articles} />
        </div>

           {/* スペーサー - 残りの空間を占有 */}
        <div className="flex-1"></div>

        {/* ページネーション - 最下部に固定 */}
        <div className="py-8">
          <Pagination meta={meta} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
}