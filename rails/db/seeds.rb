ActiveRecord::Base.transaction do
  User.create!(
    name: "テスト太郎",
    email: "test1@example.com",
    password: "password",
    confirmed_at: Time.current
    ).
    image.attach(io: File.open(Rails.root.join('app/assets/images/cat.webp')),
                  filename: 'cat.webp')


  User.create!(
    name: "テスト次郎",
    email: "test2@example.com",
    password: "password",
    confirmed_at: Time.current
    ).
    image.attach(io: File.open(Rails.root.join('app/assets/images/dog.webp')),
                  filename: 'dog.webp')
end
