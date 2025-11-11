require "rails_helper"

RSpec.describe "Api::V1::AozoraBooks", type: :request do
  describe "GET /index" do
    before do
      create(:aozora_book, :kokoro_natsume)
      create(:aozora_book, :oyagokoro)
      create(:aozora_book, :natsume_author)
    end

    context "データを取得できるとき時" do
      it "単一キーワード検索が成功すること" do
        get(api_v1_aozora_books_path, params: { keyword: "こころ" })

        res = response.parsed_body
        expect(response).to have_http_status(:ok)
        expect(res["data"].length).to eq(2)
        expect(res["data"][0]["title"]).to eq("こころ")
        expect(res["data"][0]["author"]).to eq("夏目 漱石")
        expect(res["data"][1]["title"]).to eq("親ごころ")
        expect(res["data"][1]["author"]).to eq("秋田 滋")
      end

      it "複数キーワード検索が成功すること" do
        get(api_v1_aozora_books_path, params: { keyword: "こころ 夏目" })

        res = response.parsed_body
        expect(res["data"].length).to eq(1)
        expect(response).to have_http_status(:ok)
        expect(res["data"][0]["title"]).to eq("こころ")
        expect(res["data"][0]["author"]).to eq("夏目 漱石")
      end
    end

    context "データを取得できない時" do
      expected_empty_result = { "data" => [], "meta" => { "current_page" => 1, "total_count" => 0, "total_pages" => 0 } }

      it "空文字で空配列が返ること" do
        get(api_v1_aozora_books_path, params: { keyword: "" })

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to eq(expected_empty_result)  # 空配列と等しい
      end

      it "パラメータなしで空配列が返ること" do
        get(api_v1_aozora_books_path)

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to eq(expected_empty_result)  # 空配列と等しい
      end

      it "存在しない作品で空配列が返ること" do
        get(api_v1_aozora_books_path, params: { keyword: "こころvfsejf" })

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to eq(expected_empty_result)  # 空配列と等しい
      end
    end
  end
end
