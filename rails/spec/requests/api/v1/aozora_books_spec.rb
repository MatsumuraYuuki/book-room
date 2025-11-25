require "rails_helper"

RSpec.describe "Api::V1::AozoraBooks", type: :request do
  describe "GET /index" do
    before do
      create(:aozora_book, :kokoro_natsume)
      create(:aozora_book, :oyagokoro)
      create(:aozora_book, :natsume_author)
    end

    context "正常系" do
      it "単一キーワード検索が成功する" do
        get(api_v1_aozora_books_path, params: { keyword: "こころ" })

        res = response.parsed_body
        expect(response).to have_http_status(:ok)
        expect(res["data"].length).to eq(2)
        expect(res["data"][0]["title"]).to eq("こころ")
        expect(res["data"][0]["author"]).to eq("夏目 漱石")
        expect(res["data"][1]["title"]).to eq("親ごころ")
        expect(res["data"][1]["author"]).to eq("秋田 滋")
      end

      it "複数キーワード検索が成功する" do
        get(api_v1_aozora_books_path, params: { keyword: "こころ 夏目" })

        res = response.parsed_body
        expect(res["data"].length).to eq(1)
        expect(response).to have_http_status(:ok)
        expect(res["data"][0]["title"]).to eq("こころ")
        expect(res["data"][0]["author"]).to eq("夏目 漱石")
      end
    end

    context "異常系" do
      expected_empty_result = { "data" => [], "meta" => { "current_page" => 1, "total_count" => 0, "total_pages" => 0 } }

      it "空文字で空配列が返る" do
        get(api_v1_aozora_books_path, params: { keyword: "" })

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to eq(expected_empty_result)  # 空配列と等しい
      end

      it "パラメータなしで空配列が返る" do
        get(api_v1_aozora_books_path)

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to eq(expected_empty_result)  # 空配列と等しい
      end

      it "存在しない作品で空配列が返る" do
        get(api_v1_aozora_books_path, params: { keyword: "こころvfsejf" })

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to eq(expected_empty_result)  # 空配列と等しい
      end
    end
  end

  describe "GET /content" do
    let(:aozora_book) { create(:aozora_book) }

    let(:mock_html) do
      '<div class="main_text">テスト用の本文です。</div>'
    end

    it "本文が取得できる" do
      allow(Net::HTTP).to receive(:get).and_return(mock_html)
      get(content_api_v1_aozora_book_path(aozora_book.id))

      res = response.parsed_body
      expect(response).to have_http_status(:ok)
      expect(res["title"]).to eq(aozora_book.title)
      expect(res["author"]).to eq(aozora_book.author)      
      expect(res["content"]).to include("テスト用の本文です。")
    end
  end
end
