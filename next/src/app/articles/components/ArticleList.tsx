import Link from 'next/link';
import ArticleCard from '@/app/articles/components/ArticleCard';
import { ArticleProps } from '@/types/article';

type ArticleListProps = {
  articles: ArticleProps[];
};

export default function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {articles.map((article) => (
        <div key={article.id} className="w-full">
          <Link href={`/articles/${article.id}`}>
            <ArticleCard
              title={article.title}
              fromToday={article.fromToday}
              userName={article.user.name}
            />
          </Link>
        </div>
      ))}
    </div>
  );
}