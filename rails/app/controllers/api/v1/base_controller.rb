class Api::V1::BaseController < ApplicationController
  # alias_method :新しいメソッド名, :既存のメソッド名

  # 以下の3つはdeviseで提供しているメソッド
  # サインインユーザーのuserレコードを取得する
  alias_method :current_user, :current_api_v1_user

  # サインインユーザーが認証済みであるか否かを boolean で返す
  alias_method :authenticate_user!, :authenticate_api_v1_user!

  # リクエストヘッダーに含まれる認証情報が適切であるか（何らかのサインインユーザーからのリクエストであるか）を boolean で返す。authenticate_user!の違いは、こちらは未認証のuserであっても true を返すこと。
  alias_method :user_signed_in?, :api_v1_user_signed_in?
end
