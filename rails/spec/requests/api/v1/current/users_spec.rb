require "rails_helper"

RSpec.describe "Api::V1::Current::Users", type: :request do
  describe "GET api/v1/current/user" do
    # subjectは、テスト対象となる処理を定義するRSpecの機能。テストで繰り返し実行したい処理を一箇所にまとめて定義できる
    # headers:は、headers: headersの省略記法
    subject { get(api_v1_current_user_path, headers:) }

    let(:current_user) { create(:user) }
    # dcreate_new_auth_tokenで認証に必要な"access-token","client","uid"を生成
    let(:headers) { current_user.create_new_auth_token }

    context "ヘッダー情報が正常に送られた時" do
      it "正常にレコードを取得できる" do
        subject

        # v1/current/users_controller.rbのshowアクションで render json: current_userが帰ってくる
        res = response.parsed_body
        expect(res.keys).to eq ["id", "name", "email", "image_url"]
        expect(response).to have_http_status(:ok)
      end
    end

    context "ヘッダー情報が空のままリクエストが送信された時" do
      let(:headers) { nil }

      it "unauthorized エラーが返る" do
        subject
        res = response.parsed_body
        expect(res["errors"]).to eq ["ログインもしくはアカウント登録してください。"]
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PATCH api/v1/current/user" do
    subject { patch(api_v1_current_user_path, params:, headers:) }

    let(:current_user) { create(:user) }
    let(:headers) { current_user.create_new_auth_token }

    context "更新成功の場合" do
      let(:params) { { user: { name: "updated name" } } }

      it "nameが更新される" do
        subject

        res = response.parsed_body
        # v1/current/users_controller.rbのshowアクションで render json: current_userが帰ってくる
        expect(res["name"]).to eq "updated name"
        expect(response).to have_http_status(:ok)
      end
    end

    context "更新失敗の場合" do
      let(:params) { { user: { name: nil } } }

      it "'処理失敗の情報を返す" do
        subject

        res = response.parsed_body
        expect(res["error"]).to eq "User not updated"
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
