import { AozoraBook } from '@/types/common';
import AddToBookshelfDropdown from './AddToBookshelfDropdown';

interface SearchResultItemProps {
  aozoraBook: AozoraBook;
  isLast: boolean;
}

export default function SearchResultItem({ aozoraBook, isLast }: SearchResultItemProps) {
  return (
    <div
      className={`flex justify-between py-4 space-y-2 ${!isLast ? 'border-b border-gray-300' : ''}`}
    >
      <div>
        <p className="text-xl font-bold text-gray-900">{aozoraBook.title}</p>
        <p className="text-gray-600">{aozoraBook.author}</p>
        <a
          href={aozoraBook.aozoraCardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        > 詳細を見る</a>
      </div>
      <div>
        <AddToBookshelfDropdown aozoraBookId={aozoraBook.id} />
      </div>
    </div>
  )
}