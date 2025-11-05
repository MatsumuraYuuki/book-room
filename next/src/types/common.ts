// components/Pagination.tsxで使用
export type MetaProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
};


export interface AozoraBook {
  id: number;
  aozora_book_id: string;
  title: string;
  author: string;
  published_date: string;
  aozora_content_url: string;
  aozora_card_url: string;
}

export interface SearchFormData {
  keyword: string;
}


