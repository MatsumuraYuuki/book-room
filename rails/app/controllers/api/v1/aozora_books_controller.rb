class Api::V1::AozoraBooksController < ApplicationController
  def index
    keyword = params[:keyword]
    books = AozoraBook.search(keyword) # searchはモデルメソッド
    render json: books
  end
end
