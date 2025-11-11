class Bookshelf < ApplicationRecord
  belongs_to :user
  belongs_to :aozora_book

  # enum
  enum :status, { unread: 0, reading: 1, completed: 2 }
  # バリデーション
  validates :aozora_book_id, uniqueness: { scope: :user_id }
end
