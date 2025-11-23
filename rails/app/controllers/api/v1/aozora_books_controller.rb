require "net/http"
require "uri"
require "nokogiri"

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

  def content
    # 1. DBからaozora_bookを取得
    aozora_book = AozoraBook.find(params[:id])

    # 2. aozora_content_urlから青空文庫のHTMLを取得
    url = aozora_book.aozora_content_url      # URLを取得
    uri = URI(url)                            # URIオブジェクトに変換
    html = Net::HTTP.get(uri) # HTTPリクエストでHTMLを取得

    # 3. Nokogiriで本文を抽出
    doc = Nokogiri::HTML(html)
    main_text = doc.at_css(".main_text")
    content = main_text.inner_html # Nokogiriのオブジェクトから文字列に変換
    # 4. JSONで返す
    render json: { content: content }
  end
end
