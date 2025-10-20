class User < ApplicationRecord
  devise :database_authenticatable, # DBに保存されたパスワードで認証
         :registerable, # ユーザー登録機能
         :recoverable,  # パスワードリセット機能
         :rememberable, # ログイン情報を保存する機能
         :validatable # メールアドレスとパスワードのバリデーション

  include DeviseTokenAuth::Concerns::User

  # has_one_attached は Active Storage で画像1枚を関連付けるメソッド
  # これで user.image でファイルにアクセスできるようになる
  has_one_attached :image

  # DeviseTokenAuth用にJSONレスポンスをカスタマイズ
  # imageオブジェクトをURL文字列に変換してJSONで返せるようにする
  # except: [:image]でimage 属性を除外 / merge(image_url: ...)でimage_url を追加
  def as_json(options = {})
    super(options.merge(except: :image)).merge(
      'image_url' => image.attached? ? Rails.application.routes.url_helpers.rails_blob_path(image, only_path: true) : nil
    )
  end  
  # api/v1/auth/sessions_controller.rbで使用
  def self.guest
    find_or_create_by!(email: "guest@example.com") do |user|
      user.password = SecureRandom.urlsafe_base64
      user.name = "ゲストユーザー"
    end
  end
end
