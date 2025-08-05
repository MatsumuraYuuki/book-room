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
end
