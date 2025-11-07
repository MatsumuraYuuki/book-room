class Api::V1::Current::UserController < Api::V1::BaseController
  before_action :authenticate_user! # ユーザーが認証済みであるか否かをbooleanで返す

  def show
    # CurrentUserSerializerにて id、name、email、image_urlカラムのみが、レスポンスボディーに含まれるようになる
    render json: current_user, serializer: CurrentUserSerializer
  end

  def update
    if current_user.update(user_params)
      render json: current_user, serializer: CurrentUserSerializer
    else
      render json: { error: "User not updated" }, status: :unprocessable_entity
    end
  end

  private
  
  def user_params
    params.require(:user).permit(:name, :image)
  end
end
