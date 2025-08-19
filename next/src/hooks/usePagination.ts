import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function usePagination() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // 現在のパスを取得
  
  const handlePageChange = (event: { selected: number }) => {
    const newPage = event.selected + 1; // react-paginateは0ベースなので+1
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`); // pathnameを使用
  };
  
  return { handlePageChange };
}