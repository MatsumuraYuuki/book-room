class Api::V1::BookshelvesController < Api::V1::BaseController
  before_action :authenticate_user!  # 認証必須

  def create
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