class Article < ApplicationRecord
  belongs_to :user

  enum :status, { unsaved: 10, draft: 20, published: 30 }

  # 記事が公開済みである（status == "publided"）である場合のみ、title と content が空であってはならない
  validates :title, :content, presence: true, if: :published?
  validate :verify_only_one_unsaved_status_is_allowed

  private

    # ひとりのユーザーが、複数の未保存ステータス記事を保有することを防ぐルールで
    def verify_only_one_unsaved_status_is_allowed
      if unsaved? && user.articles.unsaved.present?
        raise StandardError, "未保存の記事は複数保有できません"
      end
    end  
end
