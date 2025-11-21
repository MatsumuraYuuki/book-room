class Api::V1::BookshelvesController < Api::V1::BaseController
  before_action :authenticate_user! # 認証必須

  def index
    bookshelves = current_user.bookshelves.includes(:aozora_book)
    bookshelves = bookshelves.where(status: params[:status]) if params[:status].present?

    render json: bookshelves, status: :ok
  end

  def create
    bookshelf = current_user.bookshelves.build(bookshelf_params)
    if bookshelf.save
      render json: bookshelf, status: :created
    else
      render json: { errors: bookshelf.errors.full_messages }, status: 
      :unprocessable_entity
    end
  end

  def update
    bookshelf = current_user.bookshelves.find(params[:id])
    if bookshelf.update(bookshelf_params)
      render json: bookshelf, status: :ok
    else
      render json: { errors: bookshelf.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def destroy
    bookshelf = current_user.bookshelves.find(params[:id])
    bookshelf.destroy
    head :no_content
  end

  private
    def bookshelf_params
      params.require(:bookshelf).permit(:aozora_book_id, :status)
    end
end
