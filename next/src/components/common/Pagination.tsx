import ReactPaginate from 'react-paginate';
import { MetaProps } from '@/types/common';

interface PaginationProps {
  meta: MetaProps;
  onPageChange: (event: { selected: number }) => void;
};

export default function Pagination({ meta, onPageChange }: PaginationProps) {

  // データが空の場合はページネーションを表示しない
  if (meta.totalPages === 0) {
    return null;
  }
  
  const paginationStyles = {
    container: "flex items-center space-x-2",
    page: "inline-block",
    pageLink: "px-4 py-2 text-sm font-medium rounded-md transition-colors text-blue-600 hover:bg-blue-50 bg-white border border-gray-300",
    active: "bg-blue-600 text-white",
    activeLink: "bg-blue-600 text-white border-blue-600",
    navigation: "inline-block",
    navigationLink: "px-4 py-2 text-sm font-medium rounded-md transition-colors text-blue-600 hover:bg-blue-50 bg-white border border-gray-300",
    disabled: "text-gray-400 cursor-not-allowed bg-gray-100",
    disabledLink: "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-300",
    break: "inline-block px-4 py-2 text-gray-400"
  };

  return (
    <div className="flex justify-center"> {/* py-8 mt-auto を削除 */}
      <ReactPaginate
        pageCount={meta.totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={onPageChange}
        forcePage={meta.currentPage - 1}
        containerClassName={paginationStyles.container}
        pageClassName={paginationStyles.page}
        pageLinkClassName={paginationStyles.pageLink}
        activeClassName={paginationStyles.active}
        activeLinkClassName={paginationStyles.activeLink}
        previousLabel={<span className="whitespace-nowrap">前へ</span>}
        nextLabel={<span className="whitespace-nowrap">次へ</span>}
        previousClassName={paginationStyles.navigation}
        nextClassName={paginationStyles.navigation}
        previousLinkClassName={paginationStyles.navigationLink}
        nextLinkClassName={paginationStyles.navigationLink}
        disabledClassName={paginationStyles.disabled}
        disabledLinkClassName={paginationStyles.disabledLink}
        breakLabel="..."
        breakClassName={paginationStyles.break}
      />
    </div>
  );
}