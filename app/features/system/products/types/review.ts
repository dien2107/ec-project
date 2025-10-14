export type ReviewImages = {
  review_image_id: number;
  image_url: string;
};

export type Review = {
  review_id: number;
  username: string;
  rating: number;
  content: string;
  status: string;
  helpful_count: number;
  created_at: Date;
  updated_at: Date;
  images: ReviewImages[];
};
