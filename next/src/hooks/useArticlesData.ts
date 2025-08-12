import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import camelcaseKeys from 'camelcase-keys';
import { fetcher } from '@/utils';
import { buildApiUrl, getCurrentPage } from '@/utils/api';
import { ArticleProps, MetaProps } from '@/types/article';

export function useArticlesData() {
  const searchParams = useSearchParams();
  const currentPage = getCurrentPage(searchParams);
  const apiUrl = buildApiUrl(currentPage);
  
  const { data, error } = useSWR(apiUrl, fetcher);
  
  const articles: ArticleProps[] = data?.articles ? camelcaseKeys(data.articles) : [];
  const meta: MetaProps | null = data?.meta ? camelcaseKeys(data.meta) : null;
  
  return {
    articles,
    meta,
    error,
    isLoading: !data && !error
  };
}