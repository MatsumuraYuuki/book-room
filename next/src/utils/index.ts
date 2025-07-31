import axios, { AxiosResponse, AxiosError } from 'axios';

export const fetcher = (url: string) =>
  axios
  .get(url)    //GETメソッドのリクエストを送信  成功時.then()  失敗時.catch(). のコールバックを実行
  .then((res: AxiosResponse) => res.data) //AxiosResponse「正常に返ってきたレスポンス」の型を定義
  .catch((error: AxiosError) => {  //AxiosError は「リクエストエラー」の型を定義
    console.log(error.message)
    throw error
  })

