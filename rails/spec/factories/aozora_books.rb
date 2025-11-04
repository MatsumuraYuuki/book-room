# rails/spec/factories/aozora_books.rb
FactoryBot.define do
  factory :aozora_book do
    sequence(:aozora_book_id) {|n| "%06d" % n }
    title { "サンプル作品" }
    author { "サンプル作者" }
    aozora_content_url { "https://www.aozora.gr.jp/cards/sample.html" }
    aozora_card_url { "https://www.aozora.gr.jp/cards/sample.html" }
    published_date { "2000-01-01" }

    # trait：テーブルの属性（カラム）に対する特定の値のセット / つまりテーブル設計は同じでも、具体的な内容が異なるときに使うもの
    trait :kokoro_natsume do
      aozora_book_id { "000773" }
      title { "こころ" }
      author { "夏目 漱石" }
      published_date { "1999-07-31" }
    end

    trait :oyagokoro do
      aozora_book_id { "047074" }
      title { "親ごころ" }
      author { "秋田 滋" }
      published_date { "2010-08-21" }
    end

    trait :natsume_author do
      author { "夏目 漱石" }
    end
  end
end
