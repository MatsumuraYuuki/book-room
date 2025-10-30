class CreateAozoraBooks < ActiveRecord::Migration[7.2]
  def change
    create_table :aozora_books do |t|
      t.string :aozora_book_id, null: false #青空文庫CSVファイル内で設定されたID、railsの自動生成IDではないので注意
      t.string :title, null: false
      t.string :author, null: false
      t.string :aozora_content_url, null: false
      t.string :aozora_card_url
      t.date :published_date

      t.timestamps
    end
    add_index :aozora_books, :aozora_book_id, unique: true
    add_index :aozora_books, :title
    add_index :aozora_books, :author
  end
end
