# currentディレクトリ以下に作成したのは「ログイン中のユーザー自身に関する操作」を明確に分離するための設計
# 継承元をApplicationController から Api::V1::BaseControllerに変更
# コントローラーの継承元をApi::V1::BaseControllerにすることで、 devise 提供のメソッドをエイリアス後の命名で使用できる
class Api::V1::Current::UsersController < Api::V1::BaseController
  before_action :authenticate_user! # ユーザーが認証済みであるか否かをbooleanで返す

  def show
    # CurrentUserSerializerにて id、name、emailカラムのみが、レスポンスボディーに含まれるようになる
    render json: current_user, serializer: CurrentUserSerializer
  end

  def update
    if current_user.update(user_params)
      render json: current_user, serializer: CurrentUserSerializer
    else  
      render json: { error: "User not updated" }, status: :unprocessable_entity

    end
  end

  public

  def user_params
    params.require(:user).permit(:name, :image)
  end
end
