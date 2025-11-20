import { Bookshelf } from "@/types/common";
import { BookOpenIcon } from '@heroicons/react/24/outline';

// 型定義
interface BookshelfModalProps {
  bookshelf: Bookshelf | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookshelfModal({
  bookshelf,
  isOpen,
  onClose
}: BookshelfModalProps) {

  if (!isOpen) return null;

  const formattedDate = bookshelf?.createdAt
    ? new Date(bookshelf.createdAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <div
      onClick={onClose}
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div
        className="bg-white rounded-md w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="relative rounded-t-md flex items-center justify-end p-3 sm:p-4">
          <h2 className="absolute left-1/2 -translate-x-1/2 text-lg sm:text-xl font-medium max-w-[70%] truncate">
            {bookshelf?.aozoraBook.title}
          </h2>
          <button 
            onClick={onClose}
            className="text-xl sm:text-2xl hover:text-gray-700 transition-colors min-w-[24px]"
          >
            ✕
          </button>
        </div>

        {/* 区切り線 */}
        <hr className="border-gray-400" />                   

        {/* コンテンツエリア */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* 基本情報 */}
          <div className="space-y-2">
            <p className="text-sm sm:text-base text-gray-600 break-words">
              著者名: {bookshelf?.aozoraBook.author}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              登録日: {formattedDate}
            </p>
            <a 
              href={bookshelf?.aozoraBook.aozoraCardUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-blue-600 hover:underline inline-block"
            >
              詳細を見る
            </a>
          </div>

          {/* 区切り線 */}
          <hr className="border-gray-200" />                   

          {/* ステータス変更 */}
          <div>
            <p className="text-xs sm:text-sm font-medium mb-2">読書状況</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2 px-3 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                未読
              </button>
              <button className="flex-1 py-2 px-3 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                読書中
              </button>
              <button className="flex-1 py-2 px-3 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                読了
              </button>
            </div>            
          </div>

          {/* 区切り線 */}
          <hr className="border-gray-200" />

          {/* 読む・削除 エリア */}
          <div className="flex gap-2 sm:gap-3">
            <button className="flex-1 py-2 px-4 text-sm sm:text-base border-2 rounded-md border-gray-500 text-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <BookOpenIcon className="w-5 h-5" />
              読む
            </button>
            <button className="py-2 px-4 text-sm sm:text-base text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors">
              削除
            </button>
          </div>          
        </div>
      </div>
    </div>
  );
}