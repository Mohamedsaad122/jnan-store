import { AddressDto } from './address.dto';

export interface OrderItemDto {
  item_id: string;
  product_id: string;
  product_title_ar: string;
  product_title_en: string;
  qty_ordered: number;
  unit_price: number;
  item_image_url?: string;
}

export interface OrderDto {
  order_id: string;
  receipt_number: string;
  customer_id: string;
  order_items: OrderItemDto[];
  shipping_address: AddressDto;
  billing_address?: AddressDto;
  coupon_applied?: string;
  discount_amount: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  order_status: string;
  payment_status: string;
  tracking_code?: string;
  created_at: string;
  updated_at: string;
}
