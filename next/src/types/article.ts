export type ArticleProps = {
  id: number;
  title: string;
  createdAt: string;
  fromToday: string;
  user: {
    name: string;
  };
};

export type MetaProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
};