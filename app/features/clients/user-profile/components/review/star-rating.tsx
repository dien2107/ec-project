import { Star } from "lucide-react";
import { memo, useState } from "react";

const StarRating = memo(
  ({
    rating,
    onRatingChange,
    disabled = false,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
    disabled?: boolean;
  }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
      <div className="mb-6 flex flex-col justify-start items-center">
        <p className="text-gray-900 mb-3 font-medium">
          Đánh giá chất lượng sản phẩm
        </p>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= (hoverRating || rating);
            return (
              <button
                key={star}
                onMouseEnter={() => !disabled && setHoverRating(star)}
                onMouseLeave={() => !disabled && setHoverRating(0)}
                onClick={() => !disabled && onRatingChange(star)}
                className={`transition-transform focus:outline-none ${!disabled ? "hover:scale-110" : "cursor-default"}`}
                aria-disabled={disabled}
                type="button"
              >
                <Star
                  className={`h-10 w-10 transition-colors ${active ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              </button>
            );
          })}
        </div>
        {rating > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            {rating === 1 && "Rất không hài lòng"}
            {rating === 2 && "Không hài lòng"}
            {rating === 3 && "Bình thường"}
            {rating === 4 && "Hài lòng"}
            {rating === 5 && "Rất hài lòng"}
          </p>
        )}
      </div>
    );
  }
);

export default StarRating;
