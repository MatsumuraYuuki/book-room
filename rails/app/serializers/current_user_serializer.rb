class CurrentUserSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers  # URL生成ヘルパーを使えるようにする  
  attributes :id, :name, :email, :image_url

  # JSONで使えるようにimageオブジェクトをURL文字列に変換する
  def image_url
    if object.image.attached?
      rails_blob_path(object.image, disposition: 'inline')
    else
      nil
    end
  end
end
