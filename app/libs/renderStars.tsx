import React from "react";
import { Star, StarHalf } from "lucide-react";

export const renderStars = (rating: number, max = 5): React.ReactNode[] => {
  const stars: React.ReactNode[] = [];
  for (let i = 1; i <= max; i++) {
    if (rating >= i) stars.push(<Star key={i} fill="gold" stroke="gold" />);
    else if (rating + 0.5 >= i)
      stars.push(<StarHalf key={i} fill="gold" stroke="gold" />);
    else stars.push(<Star key={i} stroke="gold" />);
  }
  return stars;
};
