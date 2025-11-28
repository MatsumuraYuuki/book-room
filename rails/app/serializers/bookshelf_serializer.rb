class BookshelfSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :aozora_book_id, :status, :completed_at, :created_at, :updated_at, :rating, :review

  has_one :aozora_book # 関連するモデル
end
