export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin' | 'merchant';
  avatarUrl?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  title: string; // e.g., "المنزل", "العمل"
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  imageUrl?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  parentId?: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  salePrice?: number;
  images: string[];
  categoryId: string;
  sku: string;
  stock: number;
  weightQuantity?: string; // e.g., "250g", "1kg"
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  priceAtAddition: number;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Payment {
  id: string;
  orderId: string;
  method: 'mada' | 'visa' | 'mastercard' | 'apple_pay' | 'cash_on_delivery';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  transactionReference?: string;
  paidAt?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productNameAr: string;
  productNameEn: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  couponCode?: string;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment?: string;
  isApproved: boolean;
  createdAt: string;
}

// Global API payload types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
  message?: string;
}
