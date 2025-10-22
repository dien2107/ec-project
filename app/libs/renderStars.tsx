import React from "react";
import { Star, StarHalf } from "lucide-react";

export const renderStars = (
  rating: number,
  max = 5,
  size: number = 24
): React.ReactNode[] => {
  const stars: React.ReactNode[] = [];
  for (let i = 1; i <= max; i++) {
    if (rating >= i)
      stars.push(<Star key={i} size={size} fill="gold" stroke="gold" />);
    else if (rating + 0.5 >= i)
      stars.push(<StarHalf key={i} size={size} fill="gold" stroke="gold" />);
    else stars.push(<Star key={i} size={size} stroke="gold" />);
  }
  return stars;
};
