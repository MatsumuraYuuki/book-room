require 'open-uri'
require 'zip'
require 'csv'

namespace :aozora_debug do
  desc "青空文庫CSVのヘッダーを確認"
  task check_headers: :environment do
    url = "https://www.aozora.gr.jp/index_pages/list_person_all_extended_utf8.zip"
    
    puts "CSVをダウンロード中..."
    
    URI.open(url) do |zip_file|
      Zip::File.open(zip_file) do |zip|
        csv_entry = zip.glob('*.csv').first
        csv_data = csv_entry.get_input_stream.read.force_encoding('UTF-8')
        
        # ヘッダー行だけを取得
        headers = CSV.parse(csv_data, headers: true).headers
        
        puts "━━━━━━━━━━━━━━━━━━━━━━━━━━"
        puts "CSVヘッダー総数: #{headers.length}個"
        puts "━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        # 最初の10個のヘッダーを表示
        puts "\n最初の10個のヘッダー:"
        headers.first(10).each_with_index do |header, index|
          puts "#{index + 1}. 「#{header}」"
          puts "   長さ: #{header.length}文字"
          puts "   バイト: #{header.bytes.inspect}"
          puts ""
        end
        
        puts "━━━━━━━━━━━━━━━━━━━━━━━━━━"
        puts "「作品ID」を探す:"
        
        matching_headers = headers.select { |h| h.include?('作品') }
        if matching_headers.any?
          puts "「作品」を含むヘッダー:"
          matching_headers.each do |h|
            puts "  - 「#{h}」"
            puts "    バイト: #{h.bytes.inspect}"
          end
        else
          puts "「作品」を含むヘッダーが見つかりません"
        end
        
        puts "━━━━━━━━━━━━━━━━━━━━━━━━━━"
        puts "最初の3行のデータサンプル:"
        
        CSV.parse(csv_data, headers: true).first(3).each_with_index do |row, index|
          puts "\n#{index + 1}行目:"
          puts "  headers[0] で取得: #{row[headers[0]].inspect}"
          puts "  '作品ID' で取得: #{row['作品ID'].inspect}"
        end
      end
    end
  end
end