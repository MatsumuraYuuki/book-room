class Api::V1::UsersController < ApplicationController

  def index
    users = User.select(:id, :name, :image_url)
    render json: users
  end

  def show
    # URL「users/1ああ」でもID1のページが表示されてしまうエラー対処。パラメータが数値のみかチェック
    unless params[:id].match?(/^\d+$/)
      render json: { error: "Invalid user ID format" }, status: :bad_request
      return
    end

    user = User.find(params[:id])
    render json: {
      id: user.id,
      name: user.name,
      email: user.email,
      image_url: user.image_url,
    }
  rescue ActiveRecord::RecordNotFound
    render json: { error: "User not found" }, status: :not_found
  end
end
