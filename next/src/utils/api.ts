import { useAuthStore } from '../stores/authStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
  ) => {
  const { authTokens } = useAuthStore.getState();

  // 短いURLを完全なURLに変換
  const fullUrl = BASE_URL + url;

  // ヘッダーを作成　Record<string, string>は「文字列のキーと、文字列の値を持つオブジェクト」
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  // headersトークンを追加
  if (authTokens) {
    headers['access-token'] = authTokens.accessToken;
    headers['client'] = authTokens.client;
    headers['uid'] = authTokens.uid;
  }  

  // fetch関数を実行     { ...options, headers }はスプレッド構文
  return fetch(fullUrl, { ...options, headers })
}