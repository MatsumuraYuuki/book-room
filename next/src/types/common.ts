//  複数のファイルで使われる共通の型をここで定義

export interface User {
  id: number;
  name: string;
  email: string;
  imageUrl?: string;
}

export interface AozoraBook {
  id: number;
  aozoraCode: string;
  title: string;
  author: string;
  publishedDate: string;
  aozoraContentUrl: string;
  aozoraCardUrl: string;
}

// ページネーションで使用
export interface MetaProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
};