// my-books/_components/BookshelfModal.tsxで使用します。
import { FaStar } from 'react-icons/fa';


interface StarRatingProps {
  rating: number | null;
  onRatingChange: (rating: number) => void;
}

export default function StarRating({
  rating,
  onRatingChange
}: StarRatingProps) {
  return (
    <div className='flex gap-1'>
      {Array(5).fill(0).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (rating || 0);

        return (
          <button
            key={index}
            onClick={() => onRatingChange(starValue)}
            className={`mb-2 text-xl sm:text-2xl transition-all duration-200 hover:scale-125 ${isFilled ? 'text-yellow-400' : 'text-gray-400'}`}
          >
            <FaStar />
          </button>
        );
      })}
    </div>
  )
}