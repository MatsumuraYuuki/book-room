interface BookshelfFilterProps {
  selectedStatus: 'all' | 'unread' | 'reading' | 'completed';
  selectedSort: 'newest' | 'oldest';
  onStatusChange: (status: 'all' | 'unread' | 'reading' | 'completed') => void;
  onSortChange: (sort: 'newest' | 'oldest') => void;

}

export default function BookshelfControls({
  selectedStatus,
  selectedSort,
  onStatusChange,
  onSortChange
}: BookshelfFilterProps) {
  return (
    <div className='mb-4 flex gap-4 justify-between'>
      <div className=" flex gap-4 ">
        <button
          onClick={() => onStatusChange('all')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition
            ${selectedStatus === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-200 text-gray-700'
            }`}
        >
          すべて
        </button>

        <button
          onClick={() => onStatusChange('unread')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition
            ${selectedStatus === 'unread'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-200 text-gray-700'
            }`}
        >
          未読
        </button>

        <button
          onClick={() => onStatusChange('reading')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition
            ${selectedStatus === 'reading'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-200 text-gray-700'
            }`}
        >
          読書中
        </button>

        <button
          onClick={() => onStatusChange('completed')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition
            ${selectedStatus === 'completed'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-200 text-gray-700'
            }`}
        >
          読了
        </button>
      </div>
      <button
        onClick={() => onSortChange(selectedSort === "newest" ? "oldest" : "newest")}
        className='w-32 px-3 py-2 rounded-lg text-sm font-medium transition bg-gray-200 text-gray-700'
      >
        {selectedSort === "newest" ? "新しい順 ▼" : "古い順 ▲"}
      </button>
    </div>
  )
}



