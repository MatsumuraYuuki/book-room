class AozoraBook < ApplicationRecord
  has_many :bookshelves, dependent: :destroy
  has_many :users, through: :bookshelves

  # バリデーション
  validates :aozora_book_id, 
    presence: true, 
    uniqueness: true
  
  validates :title, 
    presence: true
  
  validates :author, 
    presence: true
  
  validates :aozora_content_url, 
    presence: true
  
  
  
  # /api/v1/aozora_books_controller.rbから引数keywordを受け取っている
  def self.search(keyword) 
    return AozoraBook.none if keyword.blank?

    # スペースで分割
    keywords = keyword.split(/[\s　]+/)    

    # allとは全レコードを表すActiveRecordリレーションを返すメソッドです　all = AozoraBook テーブルの全レコード
    query = all

    keywords.each do |keyword|
      # モデル名.where('カラム名 like ?','検索したい文字列'
      # %#{keyword}%で部分一致検索
      query = query.where('title LIKE ? OR author LIKE ?', "%#{keyword}%", "%#{keyword}%")
    end
    query.limit(10)
  end
end
