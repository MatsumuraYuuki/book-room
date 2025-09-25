class DropArticles < ActiveRecord::Migration[7.0]
  def up
    drop_table :articles if table_exists?(:articles)
  end

  # downはrails db:rollback時に実行される
  def down
    # 元に戻す場合の処理（20250805072524_create_articles.rbの内容をコピー）
    create_table :articles do |t|
      t.string :title, comment: "タイトル"
      t.text :content, comment: "本文"
      t.integer :status, comment: "ステータス（10:未保存, 20:下書き, 30:公開中）"
      t.bigint :user_id, null: false
      t.timestamps
    end

    add_index :articles, :user_id
    add_foreign_key :articles, :users
  end
end
