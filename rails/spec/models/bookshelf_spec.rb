require "rails_helper"

RSpec.describe Bookshelf, type: :model do
  describe "アソシエーション" do
    it "userに属している" do
      bookshelf = create(:bookshelf)
      expect(bookshelf.user).to be_present
    end

    it "aozora_bookに属している" do
      bookshelf = create(:bookshelf)
      expect(bookshelf.aozora_book).to be_present
    end
  end

  describe "バリデーション" do
    it "同じユーザーが同じ本を二重追加できない" do
      user = create(:user)
      aozora_book = create(:aozora_book)
      create(:bookshelf, user: user, aozora_book: aozora_book)

      duplicate = build(:bookshelf, user: user, aozora_book: aozora_book)
      expect(duplicate).to be_invalid
    end

    it "異なるユーザーなら同じ本を追加できる" do
      user1 = create(:user)
      user2 = create(:user)
      aozora_book = create(:aozora_book)

      create(:bookshelf, user: user1, aozora_book: aozora_book)
      bookshelf2 = build(:bookshelf, user: user2, aozora_book: aozora_book)

      expect(bookshelf2).to be_valid
    end
  end

  describe "enum" do
    it "statusが正しく動作する" do
      bookshelf = create(:bookshelf, status: :reading)
      expect(bookshelf.reading?).to be true
      expect(bookshelf.unread?).to be false
    end
  end
end
