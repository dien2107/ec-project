import { Star } from "lucide-react";
import { Progress } from "~/components/ui/progress";
import type { StarRatingRowProps } from "../types";

export default function StarRatingRow({
  stars,
  value,
  count,
}: StarRatingRowProps) {
  return (
    <div className="flex items-center justify-start gap-2 mb-2">
      <span className="mr-1">{stars}</span>
      <Star size={16} fill="gold" stroke="gold" />
      <Progress
        value={value}
        trackColor="bg-gray-200"
        fillColor="bg-[#FFD700]"
      />
      <span className="ml-4 w-10 whitespace-nowrap">{count}</span>
    </div>
  );
}
