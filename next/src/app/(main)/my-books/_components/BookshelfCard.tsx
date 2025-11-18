import { Bookshelf } from '@/types/common';

// 親コンポーネントから渡されたpropsはこのように1つのオブジェクトにまとめて 子に渡します
// props = {
//   bookshelf: { …配列の1要素の本棚データ… }
// }
interface BookshelfCardProps {
  bookshelf: Bookshelf;
}
export default function BookshelfCard({ bookshelf }: BookshelfCardProps) {
  const statusLabels = {
    unread: "未読",
    reading: "読書中",
    completed: "読了"
  }
  const getStatusStyle = (status: string) => {
    switch(status){
      case 'unread':
        return 'bg-gray-100 text-gray-600';
      case 'reading':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';    
    }
  }

  return (
    // カードの横幅をmax-w-smで指定 
    <div className='max-w-sm mx-auto w-full'>
      <div className="bg-white shadow-md  rounded-lg p-4 hover:shadow-lg transition-shadow">
        <div>
          <div className='text-lg font-bold text-gray-900 line-clamp-1'>{bookshelf.aozoraBook.title}</div>
          <div className='text-sm text-gray-600 line-clamp-1'>{bookshelf.aozoraBook.author}</div>
          <div className={`px-2 py-1 rounded text-sm ${getStatusStyle(bookshelf.status)}`}>{statusLabels[bookshelf.status]}</div>
        </div>
      </div>
    </div>
  )
}


