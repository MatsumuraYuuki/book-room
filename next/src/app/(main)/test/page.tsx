// next/src/app/test/page.tsx
'use client';

import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';

export default function TestPage() {
  const store = useAuthStore();
  
  console.log('🔍 現在のストア全体:', store);
  console.log('🔍 user:', store.user);
  console.log('🔍 isLoggedIn:', store.isLoggedIn);  
  const { 
    user, 
    isLoggedIn, 
    loading, 
    error,
    signIn,
    signUp,
    guestSignIn,
    signOut 
  } = useAuthStore();

  // フォーム用の状態管理
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // サインイン実行
  const handleSignIn = async () => {
    const result = await signIn(signInEmail, signInPassword);
    if (result) {
      alert('✅ サインイン成功！');
      setSignInEmail('');
      setSignInPassword('');
    }
  };

  // サインアップ実行
  const handleSignUp = async () => {
    const result = await signUp(signUpName, signUpEmail, signUpPassword);
    if (result) {
      alert('✅ サインアップ成功！');
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPassword('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 認証ストア 統合テストページ</h1>
      
      {/* 📊 現在の状態表示 */}
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px' 
      }}>
        <h2>📊 現在の状態</h2>
        <p>状態: {loading ? '⏳ 処理中...' : '✅ 待機中'}</p>
        <p>ログイン: {isLoggedIn ? '✅ ログイン中' : '❌ 未ログイン'}</p>
        <p>ユーザー: {user?.name || '未ログイン'}</p>
        <p>メール: {user?.email || '-'}</p>
        <p>ID: {user?.id || '-'}</p>
        {error && (
          <p style={{
            color: 'red', 
            backgroundColor: '#ffebee',
            padding: '10px',
            borderRadius: '5px'
          }}>
            ❌ エラー: {error}
          </p>
        )}
      </div>

      {/* 🔐 サインインフォーム */}
      <div style={{ 
        backgroundColor: '#e3f2fd', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px' 
      }}>
        <h2>🔐 サインイン</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={signInEmail}
            onChange={(e) => setSignInEmail(e.target.value)}
            disabled={loading}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc'
            }}
          />
          <input
            type="password"
            placeholder="パスワード"
            value={signInPassword}
            onChange={(e) => setSignInPassword(e.target.value)}
            disabled={loading}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc'
            }}
          />
          <button
            onClick={handleSignIn}
            disabled={loading || !signInEmail || !signInPassword}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '処理中...' : '📧 サインイン'}
          </button>
        </div>
      </div>

      {/* ✍️ サインアップフォーム */}
      <div style={{ 
        backgroundColor: '#f3e5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px' 
      }}>
        <h2>✍️ サインアップ</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="名前"
            value={signUpName}
            onChange={(e) => setSignUpName(e.target.value)}
            disabled={loading}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc'
            }}
          />
          <input
            type="email"
            placeholder="メールアドレス"
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
            disabled={loading}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc'
            }}
          />
          <input
            type="password"
            placeholder="パスワード"
            value={signUpPassword}
            onChange={(e) => setSignUpPassword(e.target.value)}
            disabled={loading}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc'
            }}
          />
          <button
            onClick={handleSignUp}
            disabled={loading || !signUpName || !signUpEmail || !signUpPassword}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '処理中...' : '✍️ サインアップ'}
          </button>
        </div>
      </div>

      {/* 👥 ゲストログイン & サインアウト */}
      <div style={{ 
        backgroundColor: '#e8f5e9', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px' 
      }}>
        <h2>👥 その他の操作</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={guestSignIn} 
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'ログイン中...' : '👥 ゲストログイン'}
          </button>

          <button 
            onClick={signOut} 
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            🚪 サインアウト
          </button>
        </div>
      </div>

      {/* 💡 テスト手順 */}
      <div style={{ 
        marginTop: '30px', 
        backgroundColor: '#fff9c4',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h3>💡 テスト手順</h3>
        
        <h4>📝 サインアップテスト</h4>
        <ol>
          <li>名前、メールアドレス、パスワードを入力</li>
          <li>「サインアップ」ボタンをクリック</li>
          <li>ユーザー情報が表示されることを確認</li>
          <li>サインアウト</li>
        </ol>

        <h4>🔐 サインインテスト</h4>
        <ol>
          <li>先ほど作成したアカウントでサインイン</li>
          <li>メールアドレスとパスワードを入力</li>
          <li>「サインイン」ボタンをクリック</li>
          <li>同じユーザー情報が表示されることを確認</li>
        </ol>

        <h4>👥 ゲストログインテスト</h4>
        <ol>
          <li>「ゲストログイン」ボタンをクリック</li>
          <li>ゲストユーザー情報が表示されることを確認</li>
        </ol>

        <h4>💾 Persist機能テスト</h4>
        <ol>
          <li>いずれかの方法でログイン</li>
          <li><strong>ページをリロード（F5）</strong></li>
          <li>リロード後もログイン状態が保持されているか確認</li>
        </ol>

        <h4>❌ エラーハンドリングテスト</h4>
        <ol>
          <li>存在しないメールアドレスでサインイン</li>
          <li>エラーメッセージが表示されるか確認</li>
          <li>Railsサーバーを停止してから操作</li>
          <li>ネットワークエラーが表示されるか確認</li>
        </ol>
      </div>

      {/* 🔍 デバッグ情報 */}
      <div style={{ 
        marginTop: '20px', 
        backgroundColor: '#f9f9f9', 
        padding: '15px',
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        <h3>🔍 デバッグ情報</h3>
        <p><strong>ローカルストレージ確認方法:</strong></p>
        <p>開発者ツール → Application → Local Storage → localhost:3001</p>
        <p>キー名: <code>auth-storage</code></p>
        <p><strong>ネットワーク確認方法:</strong></p>
        <p>開発者ツール → Network タブで API リクエストを確認</p>
      </div>
    </div>
  );
}