class CreateBookshelves < ActiveRecord::Migration[7.2]
  def change
    create_table :bookshelves do |t|
      t.references :user, null: false, foreign_key: true
      t.references :aozora_book, null: false, foreign_key: true
      t.integer :status, default: 0, null: false
      t.datetime :completed_at

      t.timestamps
    end
    add_index :bookshelves, [:user_id, :aozora_book_id], unique: true
  end
end
