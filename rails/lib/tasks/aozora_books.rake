require "open-uri"
require "zip"
require "csv"

namespace :aozora_books do
  desc "青空文庫の全作品データ（約15,000件）をCSVからインポート"
  task import: :environment do
    url = "https://www.aozora.gr.jp/index_pages/list_person_all_extended_utf8.zip"

    puts "青空文庫CSVをダウンロード中..."

    begin
      URI.open(url) do |zip_file|
        Zip::File.open(zip_file) do |zip|
          # zip.glob('*.csv') = ZIP内の全CSVファイルを検索 / .first = 最初のCSVファイルを取得
          csv_entry = zip.glob("*.csv").first

          puts "CSVファイルを読み込み中..."
          # ZIP内のCSVファイルを読めるように開き、中身を全部読み込む
          csv_data = csv_entry.get_input_stream.read.force_encoding("UTF-8")
          csv_data = csv_data.sub("\uFEFF", "") # ← BOM削除を追加！

          # トランザクション開始（DB操作のみをトランザクション内で実行）
          ActiveRecord::Base.transaction do
            # すでに一度DBに作品リストが登録済みの場合、エラーになるため実行前に全削除
            puts "既存データを削除中..."
            AozoraBook.delete_all

            books_data = []
            count = 0
            skipped_count = 0
            line_number = 0

            # CSV.parse が自動的にループする / CSVファイルに含まれる15,000作品全てに対し実行される
            # 「row」内に1つ1つの作品データが格納されている
            CSV.parse(csv_data, headers: true) do |row|
              line_number += 1

              begin
                # 作品IDまたは本文URLがない作品はスキップ
                if row["作品ID"].blank?
                  puts "⚠️ 行#{line_number}: 作品IDが空です"
                  puts "   行の内容: #{row.to_h.inspect}"
                  skipped_count += 1
                  next
                end

                # 本文URLがない作品はスキップ
                if row["XHTML/HTMLファイルURL"].blank?
                  skipped_count += 1
                  next
                end

                # データを配列に追加(DBには保存しない)
                # データのマッピング：CSVの列名とDBのカラム名を対応付けている
                books_data << {
                  aozora_book_id: row["作品ID"],
                  title: row["作品名"] || "", # nil対策
                  author: "#{row["姓"] || ""} #{row["名"] || ""}".strip,
                  aozora_content_url: row["XHTML/HTMLファイルURL"],
                  aozora_card_url: row["図書カードURL"],
                  published_date: row["公開日"].presence,
                  created_at: Time.current,
                  updated_at: Time.current,
                }

                count += 1

                # 配列books_dataに1000件追加された時DBにINSERTする
                if books_data.size >= 1000
                  # insert_all: 一括挿入（MySQLで動作）
                  AozoraBook.insert_all(books_data)
                  puts "#{count}件処理完了"
                  books_data = [] # 配列をクリア
                end
              rescue => e
                skipped_count += 1
                puts "⚠️ 行#{line_number}でエラー:"
                puts "   作品ID: #{row["作品ID"].inspect}"
                puts "   エラー: #{e.class}: #{e.message}"
                puts "   行の内容（最初の200文字）: #{row.to_h.inspect[0..200]}"
                next
              end
            end

            # 残りの1000件以下のデータをINSERT
            if books_data.any?
              AozoraBook.insert_all(books_data)
            end

            puts "━━━━━━━━━━━━━━━━━━━━━━━━━━"
            puts "✅ インポート完了！"
            puts "   処理件数: #{count}件"
            puts "   スキップ: #{skipped_count}件"
            puts "   DB登録: #{AozoraBook.count}件"
            puts "━━━━━━━━━━━━━━━━━━━━━━━━━━"
          end
        end
      end
    rescue => e
      puts "❌ エラーが発生しました: #{e.message}"
      puts "   バックトレース:"
      puts e.backtrace.first(5)
      raise e
    end
  end
end
