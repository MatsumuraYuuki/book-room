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
- react-hot-toast（通知表示）

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
- 作品検索・一覧画面（ページネーション、本棚追加機能含む）
- マイページ・プロフィール編集
- 通知バー機能（本棚追加、認証成功/失敗時の通知表示）
- 本棚管理機能（一覧・削除・ステータス変更）
- プロフィールダッシュボード機能（統計情報、読書中の本、最近読了した本）
- ビューアー機能

### ⬜ 未実装（フェーズ1 - これから実装）
1. 星評価・レビュー機能

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
  t.string "aozora_code", null: false         # CSVの「作品ID」
  t.string "title", null: false               # CSVの「作品名」
  t.string "author", null: false              # CSVの「姓 名」を結合
  t.string "aozora_content_url", null: false  # CSVの「XHTML/HTMLファイルURL」
  t.string "aozora_card_url"                  # CSVの「図書カードURL」
  t.date "published_date"                     # CSVの「公開日」(yearではなくdate)
  t.datetime "created_at", null: false
  t.datetime "updated_at", null: false

  t.index ["aozora_code"], unique: true
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
  t.integer "rating", default: 0, null: false  # 0:未評価, 1-5:星評価
  t.text "review"                               # レビュー本文（任意）
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
enum :status, { unread: 0, reading: 1, completed: 2 }
```

**評価・レビュー仕様:**
- rating: 0（未評価）または1-5の星評価
- review: テキスト（任意、空欄可）
- 評価は削除不可、更新のみ可能
- 星評価とレビューは独立して更新可能

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

### 青空文庫作品系
| メソッド | エンドポイント | 説明 | クエリパラメータ | レスポンス |
|---------|--------------|------|----------------|-----------|
| GET | `/api/v1/aozora_books` | 作品検索・一覧 | `?keyword=xxx&page=1` | `{ data: [...], meta: {...} }` |✅
| GET | `/api/v1/aozora_books/:id/content` | 本文取得 | - | `{ content }` (HTML文字列) |

**検索仕様:**
- 1つの検索ボックスでタイトル・作者名を同時検索（LIKE検索）
- スペース区切りで複数キーワード指定可能（例："こころ 夏目漱石"）
- 結果は12件/ページ
- ページネーションあり（kaminari使用）✅

**レスポンス形式:**
```json
{
  "data": [
    { "id": 1, "title": "こころ", "author": "夏目漱石", ... }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 10,
    "totalCount": 120
  }
}
```

**本文取得の処理:**
1. DBから`aozora_content_url`を取得
2. 青空文庫のHTMLをHTTPリクエストで取得
3. Nokogiriでパース・本文抽出・注記削除
4. フロントエンドに返却

### 本棚系
| メソッド | エンドポイント | 説明 | リクエスト | レスポンス |
|---------|--------------|------|-----------|-----------|
| GET | `/api/bookshelves` | 本棚一覧 | クエリ: `?status=xxx` | 配列 |✅
| POST | `/api/bookshelves` | 本棚に追加 | `{ aozora_book_id, status }` | `{ id, status, ... }` |✅
| GET | `/api/bookshelves/:id` | 特定作品情報 | - | `{ id, status, aozora_book, ... }` |✅
| PATCH | `/api/bookshelves/:id` | ステータス・評価・レビュー更新 | `{ status?, rating?, review? }` | `{ id, status, rating, review }` |✅
| DELETE | `/api/bookshelves/:id` | 本棚から削除 | - | `204 No Content` |✅

**PATCH /api/bookshelves/:id の詳細:**
- status、rating、reviewは個別に更新可能
- 例1: 星評価のみ更新 `{ rating: 4 }`
- 例2: レビューのみ更新 `{ review: "面白かった" }`
- 例3: 同時更新 `{ status: "completed", rating: 5, review: "名作" }`

---

## 画面設計

| 画面名 | URL | 説明 | 実装状況 |
|-------|-----|------|---------|
| 新規登録 | `/signup` | ユーザー登録 | ✅ 実装済み |
| ログイン | `/login` | ログイン | ✅ 実装済み |
| 作品検索・一覧 | `/search` | 検索 + 本棚追加 + ページネーション | ✅ 実装済み |
| 本棚 | `/my-books` | 追加済み作品一覧 |  ✅ 実装済み |
| ビューアー | `/reader/:id` | 作品を読む | ✅ 実装済み |
| マイページ | `/profile` | プロフィール表示 | ✅ 実装済み（ダッシュボード機能含む） |
| プロフィール編集 | `/profile/edit` | プロフィール編集 | ✅ 実装済み |

---

## 機能詳細仕様

### 1. 作品検索・一覧画面（/search）✅

**機能:**
- 作品名・作者名での検索フォーム
- 検索結果一覧表示（12件/ページ）
- ページネーション機能（react-paginate使用）
- 検索結果件数表示（「検索結果: 120件」）
- 空文字はReact Hook Formで対処
- 各作品に「詳細を見る」ボタン（青空文庫図書カードへ外部リンク）
- 各作品に「▼ 本棚に追加」ドロップダウンボタン
  - 未読として追加
  - 読書中として追加
  - 読了として追加
  - ユーザーが読書状況（status）を選択して本棚に追加できる
- ローディング表示（1秒以上かかる場合のみ表示してちらつき防止）
- 検索結果0件時のメッセージ表示

**表示情報:**
- 作品タイトル
- 作者名
- 総件数

**UI/レイアウト:**
- リスト形式で表示（カード形式ではない）
- 各作品は区切り線で分離
- タイトルを大きく表示（font-bold）
- 著者名はグレーで表示
- ボタンは各作品の下部に配置
- レスポンシブ対応（スマホでも見やすい）
- 理由: 青空文庫には表紙画像がなく、タイトル・著者が主な情報のため、シンプルなリスト形式が文学作品の品格に合う

### 2. 本棚画面（/my-books）

**機能:**
- 追加済み作品一覧表示（カード型）
- 本棚の登録冊数表示（全体・ステータス別）
- カードクリックでモーダル表示
- モーダル内でステータス変更・星評価・レビュー保存・削除・「読む」操作

**フィルター・並び替え:**
- ステータス別フィルター（全て/未読/読書中/読了）
- 並び替え（追加日順：新しい順/古い順）

**UI/レイアウト:**
- カード型レイアウト（グリッド表示）
- レスポンシブ対応（PC: 3〜4列、タブレット: 2列、スマホ: 1列）
- カードデザイン
  - 白背景、影付き（shadow-md）、角丸（rounded-lg）
  - ホバーで浮き上がる効果
  - クリックでモーダル表示
- ステータスバッジ（色分け）
  - 未読: グレー系（bg-gray-100, text-gray-600）
  - 読書中: ブルー系（bg-blue-100, text-blue-700）
  - 読了: グリーン系（bg-green-100, text-green-700）

**表示情報（カード）:**
- ステータスバッジ
- 作品タイトル（2行まで、それ以上は省略）
- 著者名（1行、それ以上は省略）

**表示情報（モーダル）:**
- 作品タイトル
- 著者名
- 登録日
- 青空文庫リンク（図書カードURL）
- ステータス変更ボタン（未読/読書中/読了）
- **星評価セクション（⭐新規追加）**
  - 5つ星表示（☆☆☆☆☆）
  - クリックで即座に評価更新（APIリクエスト → DB更新 → クリックした箇所までの星が光る）
  - トースト通知なし
  - 評価は削除不可、更新のみ
- **レビューセクション（📝新規追加）**
  - テキストエリア（複数行入力可能）
  - 「レビューを保存」ボタン
  - 保存時: APIリクエスト → DB更新 → トースト通知表示 → モーダル非表示
- 「読む」ボタン（ビューアー画面へ遷移）
- 「削除」ボタン（確認ダイアログあり）

**モーダルレイアウトイメージ:**
```
┌────────────────────────────────────┐
│  こころ                        ✕   │  ← タイトル + 閉じるボタン
│  夏目漱石                          │  ← 著者
├────────────────────────────────────┤
│                                    │
│  📅 登録日: 2024/01/15             │
│  🔗 青空文庫で見る →               │  ← aozora_card_urlへリンク
│                                    │
├────────────────────────────────────┤
│  読書状況                          │
│  [未読] [読書中] [読了]            │
│                                    │
├────────────────────────────────────┤
│  ⭐ 評価                           │  ← 新規追加
│  ☆☆☆☆☆                            │  ← クリックで即座に更新
│                                    │
├────────────────────────────────────┤
│  📝 レビュー                        │  ← 新規追加
│  ┌──────────────────────────────┐  │
│  │ 感想をここに書く...           │  │
│  │                              │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│  [レビューを保存]                  │  ← 保存ボタン
│                                    │
├────────────────────────────────────┤
│  [読む]              [削除]        │  ← アクションボタン
│                                    │
└────────────────────────────────────┘
```

**星評価の動作仕様:**
- クリック → 即座にPATCH /api/bookshelves/:id リクエスト
- DB更新成功 → クリックした位置までの星が光る（filled）
- トースト通知は表示しない
- モーダルは開いたまま

**レビュー保存の動作仕様:**
- 「レビューを保存」ボタンクリック → PATCH /api/bookshelves/:id リクエスト
- DB更新成功 → トースト通知表示 → モーダル非表示
- 本棚一覧画面に戻る

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

**現在の実装:**
- プロフィール画像
- ユーザー名
- メールアドレス

**編集可能項目:**
- プロフィール画像（画像アップロード）
- ユーザー名

**ダッシュボード機能（実装済み）:**

1. **統計情報カード**
   - 本棚の総冊数
   - ステータス別の冊数（未読/読書中/読了）

2. **読書中の本**
   - 現在読書中の作品リスト
   - 各作品へのリンク

3. **最近読了した本**
   - 最近読了した作品リスト（3〜5冊）
   - 読了日時表示

---

## 重要な確定事項

### ✅ 実装する
- 青空文庫CSV（15,000作品）を全件DBに登録
- 検索結果は12件/ページ（ページネーションあり）
- 本文は都度青空文庫から取得（DBに保存しない）
- ビューアーは全文表示
- **星評価・レビュー機能（個人用のみ、他ユーザーとの共有なし）**

### ❌ 実装しない
- 作品詳細画面（/books/:id）
- 読書進捗管理（何%読んだかなど）
- しおり機能
- SNS機能（レビュー公開、いいね、コメント、フォロー）
- 作品ごとのレビュー集約表示
- 複数回の読書記録

**アプリのテーマ:** 「本と自分」の2要素のみ。他ユーザーとの関係性は不要。

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

### API通信時のキャメルケース/スネークケース変換
- **TypeScript側の型定義**: camelCaseで定義
- **APIレスポンス（GET）**: `camelcase-keys`で自動変換（実装済み）
  - `next/src/lib/api.ts`のresponse interceptorで変換
  - Rails側の`aozora_code` → TypeScript側の`aozoraCode`
- **APIリクエスト（POST/PATCH）**: `snakecase-keys`で自動変換（実装済み）
  - `next/src/lib/api.ts`のrequest interceptorで対応済み
  - TypeScript側の`aozoraBookId` → Rails側の`aozora_book_id`

### ディレクトリ構造
```
next/
├── src/
│   ├── app/          # Next.js App Router
│   │   ├── (main)/search/
│   │   │   ├── page.tsx
│   │   │   └── _components/  # ページ固有コンポーネント
│   │   │       ├── SearchResultItem.tsx
│   │   │       └── AddToBookshelfDropdown.tsx
│   ├── components/   # 共通コンポーネント
│   │   ├── common/   # 汎用コンポーネント（Pagination等）
│   │   └── features/ # 機能別コンポーネント
│   ├── lib/          # ユーティリティ
│   └── types/        # TypeScript型定義

rails/
├── app/
│   ├── controllers/
│   │   ├── api/v1/   # APIコントローラー
│   │   └── concerns/ # 共通処理（Pagination等）
│   ├── models/
│   └── serializers/  # JSONレスポンス整形
```

---

## 次のステップ

### 優先実装順序
1. aozora_booksテーブル作成 + マイグレーション✅
2. bookshelvesテーブル作成 + マイグレーション✅
3. 青空文庫CSVインポートrakeタスク✅
4. 作品検索API実装✅
5. 作品検索・一覧画面実装（ページネーション含む）✅
6. 本棚追加API実装 ✅
7. 本棚一覧API実装✅
8. 本棚画面実装（/my-books）✅
9. 本棚のステータス更新API実装✅
10. 本棚の削除API実装✅
11. プロフィールページにダッシュボード機能追加✅
12. 本文取得API実装✅
13. ビューアー画面実装✅
14. プロフィールAPI実装✅
15. マイページ実装✅
16. **星評価・レビュー機能実装（次のステップ）**
    - マイグレーション（rating, review追加）
    - モデルのバリデーション
    - API更新（bookshelf_paramsにrating, review追加）
    - フロントエンド：モーダルに星評価・レビュー欄追加