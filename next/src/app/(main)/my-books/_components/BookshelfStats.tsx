// 読書状況の型定義
interface BookshelfStatsProps {
  totalCount: number;
  unreadCount: number;
  readingCount: number;
  completedCount: number;
}

// 統計情報
export default function BookshelfStats({
  totalCount,
  unreadCount,
  readingCount,
  completedCount
}: BookshelfStatsProps) {
  return (
    <div className='flex gap-4 sm:gap-6 text-xs sm:text-sm'>
      <div className='text-center'>
        <div className='text-gray-500 whitespace-nowrap'>登録数</div>
        <div className='text-lg sm:text-xl font-semibold text-black'>{totalCount}</div>
      </div>

      <div className='text-center'>
        <div className='text-gray-500 whitespace-nowrap'>未読</div>
        <div className='text-lg sm:text-xl font-semibold text-gray-400'>{unreadCount}</div>
      </div>

      <div className='text-center'>
        <div className='text-gray-500 whitespace-nowrap'>読書中</div>
        <div className='text-lg sm:text-xl font-semibold text-blue-600'>{readingCount}</div>
      </div>

      <div className='text-center'>
        <div className='text-gray-500 whitespace-nowrap'>読了</div>
        <div className='text-lg sm:text-xl font-semibold text-green-600'>{completedCount}</div>
      </div>
    </div>
  );
}