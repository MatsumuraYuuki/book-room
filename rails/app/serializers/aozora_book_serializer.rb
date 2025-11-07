class AozoraBookSerializer < ActiveModel::Serializer
  attributes :id, :aozora_code, :title, :author, :published_date, :aozora_content_url, :aozora_card_url
end
