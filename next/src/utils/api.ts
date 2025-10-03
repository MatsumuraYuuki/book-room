import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

// axiosインスタンスを作成
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター：認証トークンを自動的に追加
api.interceptors.request.use(
  (config) => {
    const { authTokens } = useAuthStore.getState();

    if (authTokens) {
      config.headers['access-token'] = authTokens.accessToken;
      config.headers['client'] = authTokens.client;
      config.headers['uid'] = authTokens.uid;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);