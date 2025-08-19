export const buildApiUrl = (page: number): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return `${baseUrl}/articles/?page=${page}`;
};

export const getCurrentPage = (searchParams: URLSearchParams): number => {
  const pageParam = searchParams.get('page');
  return pageParam ? Number(pageParam) : 1;
};