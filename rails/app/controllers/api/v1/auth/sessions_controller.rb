class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController
  
  # ゲストユーザーでログイン
  def guest_sign_in
    @resource = User.guest                # ① ゲストユーザー情報を取得
    @token = @resource.create_token       # ② 認証用トークンを作成
    @resource.save!                       # ③ トークンをDBに保存
    render_create_success                 # ④ ログイン成功レスポンスを返す
  end
end