class User < ApplicationRecord
  devise :database_authenticatable, # DBに保存されたパスワードで認証
         :registerable, # ユーザー登録機能
         :recoverable,  # パスワードリセット機能
         :rememberable, # ログイン情報を保存する機能
         :validatable # メールアドレスとパスワードのバリデーション

  include DeviseTokenAuth::Concerns::User

  # api/v1/auth/sessions_controller.rbで使用
  def self.guest
    find_or_create_by!(email: "guest@example.com") do |user|
      user.password = SecureRandom.urlsafe_base64
      user.name = "ゲストユーザー"
    end
  end
end
