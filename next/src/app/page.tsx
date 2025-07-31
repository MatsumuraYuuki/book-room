'use client'

import useSWR from 'swr'
import { fetcher } from '@/utils'

export default function Page() {
  const url = 'http://localhost:3000/api/v1/health_check'
  // 第一引数のurlを、第二引数のfetcherに渡してfetcherを動作
  const { data, error } = useSWR(url, fetcher)

  //レスポンスが正常ならその結果をdataに、エラーが発生したらその内容をerrorに代入
  if (error) return <div>An error has occurred.</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      <div>Rails疎通確認</div>
      <div>レスポンスメッセージ: {data.message}</div>
    </>    
  );
}
