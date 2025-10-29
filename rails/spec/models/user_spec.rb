require "rails_helper"

RSpec.describe User, type: :model do
  context "factoryのデフォルト設定に従った場合" do
    # factories/users.rbの情報を参照してuserを作成
    let(:user) { create(:user) }

    it "認証済みの user レコードを正常に新規作成できる" do
      # user は valid であること（バリデーションエラーがないこと）を検証
      expect(user).to be_valid
      # user が認証済み（confirmed_atカラムに値が含まれていること）を検証
      expect(user).to be_confirmed
    end
  end

  context "バリデーション" do
    let(:user) { create(:user) }

    it "name が必須であること" do
      user.name = nil
      expect(user).not_to be_valid
    end
  end
  
  context "image" do
    let(:user) { create(:user) }

    it "画像を添付できる" do
      user.image.attach(
        io: File.open(Rails.root.join('spec', 'fixtures', 'test_image.webp')),
        filename: 'test_image.webp',
        content_type: 'image/webp'
      )
      expect(user.image).to be_attached
    end

    it "画像が添付されている場合、URLを返す" do
      user.image.attach(
        io: File.open(Rails.root.join('spec', 'fixtures', 'test_image.webp')),
        filename: 'test_image.webp',
        content_type: 'image/webp'
      )
      expect(user.image_url).to include("blob") 

    end
    it "画像が添付されていない場合、nilを返す" do
      expect(user.image_url).to be_nil
    end        
  end
end
