# 本番環境ではスキップ（ゲストログイン機能でユーザー作成するため）
return if Rails.env.production?

ActiveRecord::Base.transaction do
  User.create!(
    name: "テスト太郎",
    email: "test1@example.com",
    password: "password",
    confirmed_at: Time.current,
  ).
    image.attach(io: Rails.root.join("app/assets/images/cat.webp").open,
                 filename: "cat.webp")

  User.create!(
    name: "テスト次郎",
    email: "test2@example.com",
    password: "password",
    confirmed_at: Time.current,
  ).
    image.attach(io: Rails.root.join("app/assets/images/dog.webp").open,
                 filename: "dog.webp")
end
