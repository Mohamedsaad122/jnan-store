export interface ReviewDto {
  review_id: string;
  product_id: string;
  user_id: string;
  reviewer_name: string;
  score_rating: number;
  comments?: string;
  approved_status: boolean;
  created_at: string;
}
