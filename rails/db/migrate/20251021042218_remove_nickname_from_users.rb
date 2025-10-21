class RemoveNicknameFromUsers < ActiveRecord::Migration[7.2]
  def change
    # DeviseTokenAuthのデフォルト設定により、以前削除したnicknameカラムが「rails db:migrate:reset・rails db:seed」実行時に再生成されたのでまた削除
    remove_column :users, :nickname, :string
  end
end
