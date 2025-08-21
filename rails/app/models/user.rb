class User < ApplicationRecord
  #  :confimrmable:ユーザー新規登録の際に何らかの認証操作を必須にする
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  include DeviseTokenAuth::Concerns::User

  has_many :articles, dependent: :destroy

  # api/v1/auth/sessions_controller.rbで使用
  def self.guest
    find_or_create_by!(email: "guest@example.com") do |user|
      user.password = SecureRandom.urlsafe_base64
      user.name = "ゲストユーザー"
    end
  end
end
