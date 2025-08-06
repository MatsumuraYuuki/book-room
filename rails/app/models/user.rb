
class User < ApplicationRecord

  #  :confimrmable:ユーザー新規登録の際に何らかの認証操作を必須にする
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable

  include DeviseTokenAuth::Concerns::User

  has_many :articles, dependent: :destroy

end
