class Api::V1::ArticlesController < Api::V1::BaseController
  include Pagination


  def index
    # .page(params[:page] || 1)が、 kaminari によるページネーション機能の箇所
    # pageを取得できなかった場合（params[:page] == nil）には1ページ目を返す
    # .per(10)は1ページあたりに表示するレコードを数
    articles = Article.published.order(created_at: :desc).page(params[:page] || 1).per(10).includes(:user)
    binding.pry
    # 「meta:」レスポンスにメタデータを追加するオプション　「adapter: :json」JSON形式で出力を指定
    render json: articles, meta: pagination(articles), adapter: :json

  end

  def show
    # Article.publishedは「Article.where(status: "published")」と同じ。enumの機能でこのような書き方ができる
    article = Article.published.find(params[:id])
    render json: article
  end
end