class Api::V1::BaseController < ApplicationController
  # alias_method :新しいメソッド名, :既存のメソッド名
  alias_method :current_user, :current_api_v1_user
  alias_method :authenticate_user!, :authenticate_api_v1_user!
  alias_method :user_signed_in?, :api_v1_user_signed_in?
end
