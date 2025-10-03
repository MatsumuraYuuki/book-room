class DropBooks < ActiveRecord::Migration[7.2]
  def change
    drop_table :books do |t|
      t.string :google_books_id, null: false
      t.string :title, null: false
      t.text :authors
      t.string :publisher
      t.string :published_date
      t.text :description
      t.string :isbn_13
      t.string :thumbnail_url
      t.bigint :user_id, null: false
      t.integer :reading_status, default: 0, null: false
      t.datetime :added_at
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false

      t.index :google_books_id
      t.index :reading_status
      t.index :user_id
    end
  end
end
