class Bookshelf < ApplicationRecord
  belongs_to :user
  belongs_to :aozora_book

  # enum
  enum :status, { unread: 0, reading: 1, completed: 2 }
  # バリデーション
  validates :aozora_book_id, uniqueness: { scope: :user_id }
  validates :rating, numericality: {
    only_integer: true,
    allow_nil: true,
    greater_than_or_equal_to: 1,
    less_than_or_equal_to: 5,
  }
end
