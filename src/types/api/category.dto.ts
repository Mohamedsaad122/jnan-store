export interface CategoryDto {
  category_id: string;
  name_ar: string;
  name_en: string;
  slug_code: string;
  image_url: string;
  is_active: boolean;
  product_count?: number;
}
