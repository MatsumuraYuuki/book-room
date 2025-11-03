require 'rails_helper'

RSpec.describe "Api::V1::AozoraBooks", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/api/v1/aozora_books/index"
      expect(response).to have_http_status(:success)
    end
  end

end
