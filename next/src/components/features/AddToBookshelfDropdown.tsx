'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { useMutation } from '@tanstack/react-query';

interface AddToBookshelfDropdownProps {
  aozoraBookId: number
}

interface BookshelfResponse {
  id: number;
  aozoraBookId: number
  userId:number
  status: number
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;  
}


// 親コンポーネントからprops.aozoraBookIdを受け取る
export default function AddToBookshelfDropdown({ aozoraBookId }: AddToBookshelfDropdownProps) {

  const [isOpen, setIsOpen] = useState(false)

  const clickHandler = () => {
    setIsOpen(!isOpen)
  }

  const mutation = useMutation<BookshelfResponse, Error, number>({
    mutationFn: async (status: number) => {
      const response =  await api.post("/bookshelves", {
        bookshelf: {
          // オブジェクトリテラル / オブジェクトを作っているだけ
          // aozoraBookId → コンポーネントの「引数（props）」からデータを獲得
          id: aozoraBookId,
          // status → 関数 mutationFn の「引数」からデータを獲得
          status: status
        }
      })
      return response.data;
    }
  })

  return (
    <>
      <button onClick={clickHandler} className='px-4 py-2 border rounded'>本棚に追加</button>
      {isOpen && (
        <div> 
          {/* mutate()の引数にstatusを指定 */}
          <button onClick={() => mutation.mutate(0)}>未読として追加</button>
          <button onClick={() => mutation.mutate(1)}>読書中として追加</button>
          <button onClick={() => mutation.mutate(2)}>読了として追加</button>
        </div>
      )}
    </>
  );
}

