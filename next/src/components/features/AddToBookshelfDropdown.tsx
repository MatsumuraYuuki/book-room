'use client'

import { useState, useEffect, useRef } from 'react'
import { BookmarkIcon } from '@heroicons/react/24/outline'
import { api } from '@/lib/api'
import { useMutation } from '@tanstack/react-query';

interface AddToBookshelfDropdownProps {
  aozoraBookId: number
}

interface BookshelfResponse {
  id: number;
  aozoraBookId: number
  userId: number
  status: number
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}


// 親コンポーネントからprops.aozoraBookIdを受け取る
export default function AddToBookshelfDropdown({ aozoraBookId }: AddToBookshelfDropdownProps) {

  const [isOpen, setIsOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null) //「メニュー外クリックで閉じる」処理

  const buttonOptions = [
    { status: 0, label: "未読として登録" },
    { status: 1, label: "読書中として登録" },
    { status: 2, label: "読了として登録" }
  ]

  const clickHandler = () => {
    setIsOpen(!isOpen)
  }

  const mutation = useMutation<BookshelfResponse, Error, number>({
    mutationFn: async (status: number) => {
      const response = await api.post("/bookshelves", {
        bookshelf: {
          // オブジェクトリテラル / オブジェクトを作っているだけ
          // aozoraBookId → コンポーネントの「引数（props）」からデータを獲得
          aozoraBookId: aozoraBookId,
          // status → 関数 mutationFn の「引数」からデータを獲得
          status: status
        }
      })
      return response.data;
    }
  })
  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false)
    }
  }

  document.addEventListener('mousedown', handleClickOutside)
  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
  }
}, [])

  return (
    <div className='relative inline-block' ref={dropdownRef}>
      <button
        type="button"
        onClick={clickHandler}
        className='flex items-center gap-1 px-4 py-2 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors'
      >
        <BookmarkIcon className="h-6 w-6"/>
        本棚に登録
      </button>
      {isOpen && (
        <div className='absolute left-0 mt-2 w-48  bg-white border border-gray-200 rounded-lg shadow-lg z-20'>
          {/* mutate()の引数にstatusを指定 */}
          {buttonOptions.map((buttonOption) => (
            <button
              type="button"
              key={buttonOption.status}
              onClick={() => {
                mutation.mutate(buttonOption.status)
                setIsOpen(false)
              }}
              className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors'
            >
              {buttonOption.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

