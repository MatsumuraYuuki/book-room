import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import { useAuthStore } from '../stores/authStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

//  使う時 : await api.METHODS(第一引数: URL, 第二引数: 送信するデータ, 第三引数: 設定(config));
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// https://axios-http.com/ja/docs/interceptors
//リクエスト(=送るときの処理) / axiosが提供する「リクエストを送る前に処理を挟む」ためのメソッド
api.interceptors.request.use(
  (config) => {
    // .getState()で発火した時、全てのstateの状態を取得する
    const { authTokens } = useAuthStore.getState();
    if (authTokens) {
      // 取得した全てのstateの状態から認証に必要なものだけ取り出す
      config.headers['access-token'] = authTokens.accessToken;
      config.headers['client'] = authTokens.client;
      config.headers['uid'] = authTokens.uid;
    }

    // railsが理解しやすいスネークデータに変換
    if (config.data && !(config.data instanceof FormData)) {
      config.data = snakecaseKeys(config.data, { deep: true });
    }    

    // return configで「設定を変更（認証情報の追加）変更された」とaxiosは自動で認識する
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンス(=受け取ったときの処理)インターセプターを追加します
api.interceptors.response.use(function onFulfilled(response) {
    // ステータスコードが 2xx の範囲にある場合、この関数が起動します
    // レスポンス データの処理
    response.data = camelcaseKeys(response.data, { deep: true })
    return response;
  }, function onRejected(error) {
    // ステータスコードが 2xx の範囲外の場合、この関数が起動します
    // レスポンス エラーの処理
    return Promise.reject(error);
  });