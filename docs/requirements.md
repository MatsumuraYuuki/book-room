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
- react-query

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
4. マイページ・プロフィール編集✅

---

## データベース設計

### 1. users テーブル（既存）✅
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

### 2. aozora_books テーブル（新規作成）✅
青空文庫の全作品データ（約15,000件）を保存
```ruby
create_table "aozora_books", charset: "utf8mb4" do |t|
  t.string "aozora_book_id", null: false      # CSVの「作品ID」
  t.string "title", null: false               # CSVの「作品名」
  t.string "author", null: false              # CSVの「姓 名」を結合
  t.string "aozora_content_url", null: false  # CSVの「XHTML/HTMLファイルURL」
  t.string "aozora_card_url"                  # CSVの「図書カードURL」
  t.date "published_date"                     # CSVの「公開日」(yearではなくdate)
  t.datetime "created_at", null: false
  t.datetime "updated_at", null: false
  
  t.index ["aozora_book_id"], unique: true
  t.index ["title"]
  t.index ["author"]
end
```

### 3. bookshelves テーブル（新規作成）✅
ユーザーが追加した作品の読書管理
```ruby
create_table "bookshelves", charset: "utf8mb4" do |t|
  t.bigint "user_id", null: false
  t.references :aozora_book, null: false, foreign_key: true #「外部キー制約を自動で追加」
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
| POST | `/api/auth` | 新規登録 |✅
| POST | `/api/auth/sign_in` | ログイン |✅
| DELETE | `/api/auth/sign_out` | ログアウト |✅

### ユーザー系（未実装）
| メソッド | エンドポイント | 説明 | リクエスト | レスポンス |
|---------|--------------|------|-----------|-----------|
| GET | `/api/users/:id` | プロフィール取得 | - | `{ id, name, image, email }` |✅
| PATCH | `/api/users/:id` | プロフィール更新 | `{ name, image }` | `{ id, name, image }` |✅

### 青空文庫作品系（未実装）
| メソッド | エンドポイント | 説明 | クエリパラメータ | レスポンス |
|---------|--------------|------|----------------|-----------|
| GET | `/api/v1/aozora_books` | 作品検索・一覧 | `?keyword=xxx` | 最大10件の配列 |✅
| GET | `/api/v1/aozora_books/:id/content` | 本文取得 | - | `{ content }` (HTML文字列) |

**検索仕様:**
- 1つの検索ボックスでタイトル・作者名を同時検索（LIKE検索）
- スペース区切りで複数キーワード指定可能（例："こころ 夏目漱石"）
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
| POST | `/api/bookshelves` | 本棚に追加 | `{ aozora_book_id, status }` | `{ id, status, ... }` |
| GET | `/api/bookshelves/:id` | 特定作品情報 | - | `{ id, status, aozora_book, ... }` |
| PATCH | `/api/bookshelves/:id` | ステータス更新 | `{ status }` | `{ id, status }` |
| DELETE | `/api/bookshelves/:id` | 本棚から削除 | - | `204 No Content` |

---

## 画面設計

| 画面名 | URL | 説明 | 実装状況 |
|-------|-----|------|---------|
| 新規登録 | `/signup` | ユーザー登録 | ✅ 実装済み |
| ログイン | `/login` | ログイン | ✅ 実装済み |
| 作品検索・一覧 | `/search` | 検索 + 本棚追加 | ⬜ 未実装 |
| 本棚 | `/my-books` | 追加済み作品一覧 | ⬜ 未実装 |
| ビューアー | `/reader/:id` | 作品を読む | ⬜ 未実装 |
| マイページ | `/profile` | プロフィール表示 | ⬜ 一部実装済み |
| プロフィール編集 | `/profile/edit` | プロフィール編集 | ⬜ 一部実装済み |

---

## 機能詳細仕様

### 1. 作品検索・一覧画面（/search）

**機能:**
- 作品名・作者名での検索フォーム
- 検索結果一覧表示（最大10件）
- 空文字はReact Hook Formで対処
- 各作品に「詳細を見る」ボタン（青空文庫図書カードへ外部リンク）
- 各作品に「▼ 本棚に追加」ドロップダウンボタン
  - 未読として追加
  - 読書中として追加
  - 読了として追加
  - ユーザーが読書状況（status）を選択して本棚に追加できる

**表示情報:**
- 作品タイトル
- 作者名

**UI/レイアウト:**
- リスト形式で表示（カード形式ではない）
- 各作品は区切り線で分離
- タイトルを大きく表示（font-bold）
- 著者名はグレーで表示
- ボタンは各作品の下部に配置
- レスポンシブ対応（スマホでも見やすい）
- 理由: 青空文庫には表紙画像がなく、タイトル・著者が主な情報のため、シンプルなリスト形式が文学作品の品格に合う
<!-- リスト形式例
  ┌─────────────────────────────────────────────┐
  │ 人間失格                                      │
  │ 太宰治                                        │
  │ [詳細を見る] [▼ 本棚に追加]                   │
  │                └→ 未読として追加              │
  │                └→ 読書中として追加            │
  │                └→ 読了として追加              │
  └─────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────┐
  │ こころ                                        │
  │ 夏目漱石                                      │
  │ [詳細を見る] [▼ 本棚に追加]                   │
  └─────────────────────────────────────────────┘
 -->

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
1. aozora_booksテーブル作成 + マイグレーション✅
2. bookshelvesテーブル作成 + マイグレーション✅
3. 青空文庫CSVインポートrakeタスク✅
4. 作品検索API実装✅
5. 作品検索・一覧画面実装
6. 本棚追加API実装
7. 本棚一覧API実装
8. 本棚画面実装
9. 本文取得API実装
10. ビューアー画面実装
11. プロフィールAPI実装✅
12. マイページ実装✅