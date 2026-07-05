export interface ProductImageDto {
  image_id: string;
  image_url: string;
  alt_text_ar: string;
  alt_text_en: string;
  is_primary: boolean;
}

export interface ProductVariantDto {
  variant_id: string;
  variant_name_ar: string;
  variant_name_en: string;
  variant_price: number;
  variant_sale_price?: number;
  variant_stock: number;
  sku_code: string;
  meta_attributes: Record<string, string>;
}

export interface ProductDto {
  product_id: string;
  name_ar: string;
  name_en: string;
  product_slug: string;
  desc_ar: string;
  desc_en: string;
  base_price: number;
  sale_price?: number;
  image_urls: string[];
  category_id: string;
  brand_id?: string;
  sku_code: string;
  stock_qty: number;
  weight_qty?: string;
  avg_rating: number;
  reviews_count: number;
  is_active: boolean;
  is_featured: boolean;
  raw_variants?: ProductVariantDto[];
  specifications_map?: Record<string, string>;
  created_at: string;
  updated_at: string;
}
