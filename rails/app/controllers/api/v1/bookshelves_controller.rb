class Api::V1::BookshelvesController < Api::V1::BaseController
  before_action :authenticate_user! # 認証必須

    def index
        bookshelves = current_user.bookshelves.includes(:aozora_book)
        # status: params[:status]は「キーが:status」、「値が"reading"」のハッシュを作成しています。
        # params[:status]はparamsというハッシュの中にある、:statusというキーを使って:statusの値(readingなど)を取得する。
        bookshelves = bookshelves.where(status: params[:status]) if params[:status].present?
        # (include: :aozora_book)でレスポンスにaozora_bookを追加
        render json: bookshelves.as_json(include: :aozora_book), status: :ok
    end

  def create
    # current_userに紐づいた新しいBookshelfレコードを作る
    bookshelf = current_user.bookshelves.build(bookshelf_params)
    if bookshelf.save
      render json: bookshelf, status: :created
    else
      render json: { errors: bookshelf.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

    def bookshelf_params
      params.require(:bookshelf).permit(:aozora_book_id, :status)
    end
end
