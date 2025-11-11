FactoryBot.define do
  factory :bookshelf do
    association :user
    association :aozora_book
    status { :unread }

    trait :reading do
      status { :reading }
    end

    trait :completed do
      status { :completed }
    end
  end
end
