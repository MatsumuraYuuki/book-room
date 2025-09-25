ActiveRecord::Base.transaction do
  User.create!(name: "テスト太郎", email: "test1@example.com", password: "password", confirmed_at: Time.current)

  User.create!(name: "テスト次郎", email: "test2@example.com", password: "password", confirmed_at: Time.current)
end
