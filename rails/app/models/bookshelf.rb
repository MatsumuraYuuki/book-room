class Bookshelf < ApplicationRecord
  belongs_to :user
  belongs_to :aozora_book
end
