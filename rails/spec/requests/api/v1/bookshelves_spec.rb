require "rails_helper"

RSpec.describe "Api::V1::Bookshelves", type: :request do
  describe "POST /api/v1/bookshelves" do
    subject { post(api_v1_bookshelves_path, params:, headers:) }

    let(:aozora_book) { create(:aozora_book) }
    let(:params) { { bookshelf: { aozora_book_id: aozora_book.id, status: :unread } } }
    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }

    it "正常に本が追加される" do
      subject

      expect(response).to have_http_status(:created)
      res = response.parsed_body
      expect(res["status"]).to eq("unread")
    end

    context "異常系" do
      context "認証なしの場合" do
        let(:headers) { nil } # ← contextの中、itの外
        it "認証なしでアクセスした場合、401エラーが返る" do
          subject
          res = response.parsed_body
          expect(res["errors"]).to eq ["ログインもしくはアカウント登録してください。"]
          expect(response).to have_http_status(:unauthorized)
        end
      end

      context "存在しないaozora_book_idの場合" do
        let(:params) { { bookshelf: { aozora_book_id: 999999, status: :unread } } }
        it "存在しないaozora_book_idを指定した場合、エラーが返る" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      context "同じ本を二重追加する場合" do
        it "エラーが返る" do
          post(api_v1_bookshelves_path, params:, headers:)  # 1回目
          post(api_v1_bookshelves_path, params:, headers:)  # 2回目

          expect(response).to have_http_status(:unprocessable_entity)
          res = response.parsed_body
          expect(res["errors"]).to be_present
        end
      end
    end
  end
end
