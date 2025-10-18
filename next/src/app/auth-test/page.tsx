// pages/auth-test.tsx または app/auth-test/page.tsx
'use client';

import { useAuthStore } from '@/stores/authStore'
import { useState } from 'react';

const AuthTestPage = () => {
  const { user, isLoggedIn, loading, error, signIn, signOut } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleTestSignIn = async () => {
    console.log('🚀 ログインテスト開始');
    const result = await signIn(email, password);
    console.log('📊 ログイン結果:', result);
  };

  const handleTestSignOut = () => {
    console.log('🚪 ログアウトテスト開始');
    signOut();
    console.log('✅ ログアウト完了');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 認証システムテストページ</h1>
      
      {/* 現在の状態表示 */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        margin: '20px 0', 
        borderRadius: '5px' 
      }}>
        <h2>📊 現在の状態</h2>
        <p><strong>ログイン状態:</strong> {isLoggedIn ? '✅ ログイン中' : '❌ 未ログイン'}</p>
        <p><strong>ユーザー情報:</strong> {user ? `${user.name} (${user.email})` : 'なし'}</p>
        <p><strong>読み込み中:</strong> {loading ? '⏳ はい' : '❌ いいえ'}</p>
        <p><strong>エラー:</strong> {error ? `❌ ${error}` : '✅ なし'}</p>
      </div>

      {/* ログインフォーム */}
      {!isLoggedIn && (
        <div style={{ 
          background: '#e8f4fd', 
          padding: '15px', 
          margin: '20px 0', 
          borderRadius: '5px' 
        }}>
          <h2>🔐 ログインテスト</h2>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              display: 'block', 
              margin: '5px 0', 
              padding: '10px', 
              width: '300px' 
            }}
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              display: 'block', 
              margin: '5px 0', 
              padding: '10px', 
              width: '300px' 
            }}
          />
          <button 
            onClick={handleTestSignIn}
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              margin: '10px 0', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '3px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ ログイン中...' : '🔐 ログインテスト'}
          </button>
        </div>
      )}

      {/* ログアウトボタン */}
      {isLoggedIn && (
        <div style={{ 
          background: '#ffe8e8', 
          padding: '15px', 
          margin: '20px 0', 
          borderRadius: '5px' 
        }}>
          <h2>👋 ログアウトテスト</h2>
          <button 
            onClick={handleTestSignOut}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            🚪 ログアウトテスト
          </button>
        </div>
      )}

      {/* デバッグ情報 */}
      <div style={{ 
        background: '#fff3cd', 
        padding: '15px', 
        margin: '20px 0', 
        borderRadius: '5px' 
      }}>
        <h2>🔍 デバッグ情報</h2>
        <button 
          onClick={() => console.log('🔍 全認証状態:', { user, isLoggedIn, loading, error })}
          style={{ 
            padding: '5px 10px', 
            margin: '5px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          コンソールに状態を出力
        </button>
        <button 
          onClick={() => console.log('💾 ローカルストレージ:', localStorage.getItem('auth-storage'))}
          style={{ 
            padding: '5px 10px', 
            margin: '5px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          ローカルストレージを確認
        </button>
      </div>
    </div>
  );
};

export default AuthTestPage;