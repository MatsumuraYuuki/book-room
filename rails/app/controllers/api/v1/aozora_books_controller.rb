class Api::V1::AozoraBooksController < ApplicationController
  include Pagination # /concerns/pagination.rbを呼び出して利用

  def index
    keyword = params[:keyword]
    page = params[:page]
    books = AozoraBook.search(keyword, page)
    render json: {
      data: books,
      meta: pagination(books),
    }
  end
end