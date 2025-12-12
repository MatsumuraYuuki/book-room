class AddRatingAndReviewToBookshelves < ActiveRecord::Migration[7.2]
  def change
    add_column :bookshelves, :rating, :integer
    add_column :bookshelves, :review, :text
  end
end
