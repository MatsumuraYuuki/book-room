# 青空本棚 - 要件定義書（Claude Code用）

## プロジェクト概要
青空文庫の純文学作品を自分のアカウントに追加し、読書管理できるWebアプリケーション

**コンセプト**: 純文学を手軽に読みやすく

---

## 技術スタック

### フロントエンド
- Next.js 14.2.30 (App Router)
- React 18
- TypeScript 5.3.3
- Tailwind CSS 3.4.1
- Zustand（状態管理）
- axios（HTTPクライアント）
- React Hook Form（フォーム管理）

### バックエンド
- Ruby 3.2.2
- Rails 7.2.2.1 (API mode)
- MySQL 8.0.40
- DeviseTokenAuth（認証）

### インフラ・ツール
- Docker / docker-compose
- ECS on Fargate（本番環境）
- GitHub Actions (CI/CD)
- RSpec / Rubocop

---

## 実装状況

### ✅ 実装済み
- ユーザー新規登録（DeviseTokenAuth）
- ログイン・ログアウト

### ⬜ 未実装（フェーズ1 - これから実装）
1. 作品検索・一覧画面
2. 本棚管理機能
3. ビューアー機能
4. マイページ・プロフィール編集

---

## データベース設計

### 1. users テーブル（既存）
```ruby
create_table "users", charset: "utf8mb4" do |t|
  t.string "provider", default: "email", null: false
  t.string "uid", default: "", null: false
  t.string "encrypted_password", default: "", null: false
  t.string "name"
  t.string "image"
  t.string "email"
  t.text "tokens"
  t.datetime "created_at", null: false
  t.datetime "updated_at", null: false
  
  t.index ["email"], unique: true
  t.index ["uid", "provider"], unique: true
end
```

### 2. aozora_books テーブル（新規作成）
青空文庫の全作品データ（約15,000件）を保存
```ruby
create_table "aozora_books", charset: "utf8mb4" do |t|
  t.string "title", null: false              # 作品タイトル
  t.string "author", null: false             # 作者名
  t.string "aozora_content_url", null: false # 本文HTML URL
  t.string "aozora_card_url"                 # 図書カード URL
  t.integer "character_count"                # 文字数
  t.integer "estimated_reading_time"         # 推定読書時間（分）
  t.integer "published_year"                 # 公開年
  t.datetime "created_at", null: false
  t.datetime "updated_at", null: false
  
  t.index ["title"]
  t.index ["author"]
end
```

### 3. bookshelves テーブル（新規作成）
ユーザーが追加した作品の読書管理
```ruby
create_table "bookshelves", charset: "utf8mb4" do |t|
  t.bigint "user_id", null: false
  t.bigint "aozora_book_id", null: false
  t.integer "status", default: 0, null: false  # 0:未読, 1:読書中, 2:読了
  t.datetime "completed_at"                     # 読了日時
  t.datetime "created_at", null: false
  t.datetime "updated_at", null: false
  
  t.index ["user_id", "aozora_book_id"], unique: true
  t.index ["user_id"]
  t.index ["aozora_book_id"]
end

add_foreign_key "bookshelves", "users"
add_foreign_key "bookshelves", "aozora_books"
```

**statusのEnum定義（Rails）:**
```ruby
enum status: { unread: 0, reading: 1, completed: 2 }
```

---

## APIエンドポイント設計

### 認証系（実装済み）
| メソッド | エンドポイント | 説明 |
|---------|--------------|------|
| POST | `/api/auth` | 新規登録 |
| POST | `/api/auth/sign_in` | ログイン |
| DELETE | `/api/auth/sign_out` | ログアウト |

### ユーザー系（未実装）
| メソッド | エンドポイント | 説明 | リクエスト | レスポンス |
|---------|--------------|------|-----------|-----------|
| GET | `/api/users/:id` | プロフィール取得 | - | `{ id, name, image, email }` |
| PATCH | `/api/users/:id` | プロフィール更新 | `{ name, image }` | `{ id, name, image }` |

### 青空文庫作品系（未実装）
| メソッド | エンドポイント | 説明 | クエリパラメータ | レスポンス |
|---------|--------------|------|----------------|-----------|
| GET | `/api/aozora_books` | 作品検索・一覧 | `?title=xxx&author=xxx` | 最大10件の配列 |
| GET | `/api/aozora_books/:id/content` | 本文取得 | - | `{ content }` (HTML文字列) |

**検索仕様:**
- タイトル・作者名での部分一致検索（LIKE検索）
- 結果は最大10件まで
- ページネーションなし

**本文取得の処理:**
1. DBから`aozora_content_url`を取得
2. 青空文庫のHTMLをHTTPリクエストで取得
3. Nokogiriでパース・本文抽出・注記削除
4. フロントエンドに返却

### 本棚系（未実装）
| メソッド | エンドポイント | 説明 | リクエスト | レスポンス |
|---------|--------------|------|-----------|-----------|
| GET | `/api/bookshelves` | 本棚一覧 | クエリ: `?status=xxx` | 配列 |
| POST | `/api/bookshelves` | 本棚に追加 | `{ aozora_book_id }` | `{ id, status, ... }` |
| GET | `/api/bookshelves/:id` | 特定作品情報 | - | `{ id, status, aozora_book, ... }` |
| PATCH | `/api/bookshelves/:id` | ステータス更新 | `{ status }` | `{ id, status }` |
| DELETE | `/api/bookshelves/:id` | 本棚から削除 | - | `204 No Content` |

---

## 画面設計

| 画面名 | URL | 説明 | 実装状況 |
|-------|-----|------|---------|
| 新規登録 | `/signup` | ユーザー登録 | ✅ 実装済み |
| ログイン | `/login` | ログイン | ✅ 実装済み |
| 作品検索・一覧 | `/books` | 検索 + 本棚追加 | ⬜ 未実装 |
| 本棚 | `/my-books` | 追加済み作品一覧 | ⬜ 未実装 |
| ビューアー | `/reader/:id` | 作品を読む | ⬜ 未実装 |
| マイページ | `/profile` | プロフィール表示 | ⬜ 未実装 |
| プロフィール編集 | `/profile/edit` | プロフィール編集 | ⬜ 未実装 |

---

## 機能詳細仕様

### 1. 作品検索・一覧画面（/books）

**機能:**
- 作品名・作者名での検索フォーム
- 検索結果一覧表示（最大10件）
- 各作品に「詳細を見る」ボタン（青空文庫図書カードへ外部リンク）
- 各作品に「本棚に追加」ボタン

**表示情報:**
- 作品タイトル
- 作者名
- 推定読書時間
- 文字数

### 2. 本棚画面（/my-books）

**機能:**
- 追加済み作品一覧表示
- ステータス表示（未読/読書中/読了）
- ステータス変更ボタン
- 「読む」ボタン（ビューアーへ遷移）
- 削除ボタン（確認ダイアログあり）

**フィルター・並び替え:**
- ステータス別フィルター（全て/未読/読書中/読了）
- 並び替え（追加日順/作品名順）

### 3. ビューアー画面（/reader/:id）

**機能:**
- 全文表示（スクロール形式）
- フォントサイズ変更（小/中/大）
- 背景色変更（白/黒）
- レスポンシブ対応

**表示:**
- 作品タイトル
- 作者名
- 本文（HTML）

### 4. マイページ・プロフィール編集

**表示情報:**
- プロフィール画像
- ユーザー名
- メールアドレス

**編集可能項目:**
- プロフィール画像（画像アップロード）
- ユーザー名

---

## 重要な確定事項

### ✅ 実装する
- 青空文庫CSV（15,000作品）を全件DBに登録
- 検索結果は最大10件のみ表示
- 本文は都度青空文庫から取得（DBに保存しない）
- ビューアーは全文表示

### ❌ 実装しない
- 作品詳細画面（/books/:id）
- ページネーション
- 読書進捗管理（何%読んだかなど）
- しおり機能
- フェーズ2の機能（感想投稿、いいね、コメント、おすすめ、統計）

---

## 初期セットアップ

### 1. 青空文庫データのインポート
```bash
# rakeタスクを作成して実行
rails aozora_books:import
```

**処理内容:**
1. 青空文庫CSVをダウンロード
2. CSVをパース
3. aozora_booksテーブルに全件インポート（約15,000件）

### 2. プロフィール画像の保存先
- Active Storageを使用
- 本番環境ではS3に保存

---

## コーディング規約

### Ruby/Rails
- snake_case（変数、メソッド）
- PascalCase（クラス）
- Rubocop準拠

### TypeScript/React
- camelCase（変数、関数）
- PascalCase（コンポーネント、型）
- ファイル名: kebab-case
- ESLint/Prettier準拠

### ディレクトリ構造
```
next/
├── src/
│   ├── app/          # Next.js App Router
│   ├── components/   # 共通コンポーネント
│   ├── lib/          # ユーティリティ
│   └── types/        # TypeScript型定義

rails/
├── app/
│   ├── controllers/api/  # APIコントローラー
│   ├── models/
│   └── serializers/      # JSONレスポンス整形
```

---

## 次のステップ

### 優先実装順序
1. aozora_booksテーブル作成 + マイグレーション
2. bookshelvesテーブル作成 + マイグレーション
3. 青空文庫CSVインポートrakeタスク
4. 作品検索API実装
5. 作品検索・一覧画面実装
6. 本棚追加API実装
7. 本棚一覧API実装
8. 本棚画面実装
9. 本文取得API実装
10. ビューアー画面実装
11. プロフィールAPI実装
12. マイページ実装