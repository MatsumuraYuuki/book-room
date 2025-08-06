class Api::V1::Current::ArticlesController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    # .not_unsavedはRailsのenumによる自動生成メソッド
    articles = current_user.articles.not_unsaved.order(created_at: :desc)
    render json: articles
  end

  def show
    article = current_user.articles.find(params[:id])
    render json: article
  end  

  def create
    # 「||」左側が falsy（偽値：nil, false）な場合：右側が実行され、その値が返される
    unsaved_article = current_user.articles.unsaved.first || current_user.articles.create!(status: :unsaved)
    render json: unsaved_article
  end


  def update
    article = current_user.articles.find(params[:id])
    article.update!(article_params)
    render json: article
  end

  private

    def article_params
      params.require(:article).permit(:title, :content, :status)
    end
end