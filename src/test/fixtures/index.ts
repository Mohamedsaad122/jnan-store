import { Product, Category, Coupon, Order } from '@/types/domain';
import { User } from '@/features/auth/types';

export const mockUser: User = {
  id: 'usr-mock-123',
  firstName: 'محمد',
  lastName: 'سعد',
  email: 'test@example.com',
  phone: '0501234567',
  role: 'user',
  permissions: ['read:products', 'write:reviews'],
  avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=محمد',
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const mockCategories: Category[] = [
  {
    id: 'cat-coffee',
    nameAr: 'قهوة مختصة',
    nameEn: 'Specialty Coffee',
    slug: 'specialty-coffee',
    descriptionAr: 'أجود أنواع القهوة المختصة',
    descriptionEn: 'Finest specialty coffee beans',
    isActive: true,
  },
  {
    id: 'cat-tools',
    nameAr: 'أدوات الترشيح',
    nameEn: 'Brewing Tools',
    slug: 'brewing-tools',
    descriptionAr: 'أدوات تحضير القهوة',
    descriptionEn: 'Coffee brewing accessories',
    isActive: true,
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prod-yemen-123',
    nameAr: 'بن اليمن الهرري',
    nameEn: 'Yemen Harazi Coffee',
    slug: 'yemen-harazi-coffee',
    descriptionAr: 'قهوة يمنية فاخرة ذات نكهات فاكهية شذية وطبيعية بالكامل.',
    descriptionEn: 'Premium Yemeni coffee with rich fruity notes and fully natural processing.',
    price: 120.0,
    salePrice: 105.0,
    images: [
      {
        id: 'yemen-harazi-img-0',
        url: '/assets/images/yemen-harazi.jpg',
        altAr: 'صورة بن اليمن الهرري',
        altEn: 'Image of Yemen Harazi Coffee',
        isPrimary: true,
      },
    ],
    categoryId: 'cat-coffee',
    category: mockCategories[0],
    sku: 'COF-YEM-001',
    stock: 15,
    weightQuantity: '250g',
    rating: 4.8,
    reviewsCount: 12,
    isActive: true,
    isFeatured: true,
    variants: [
      {
        id: 'prod-yemen-123-default-var',
        productId: 'prod-yemen-123',
        nameAr: '٢٥٠ غرام',
        nameEn: '250g',
        price: 120.0,
        salePrice: 105.0,
        stock: 15,
        sku: 'COF-YEM-001-250',
        attributes: { weight: '250g' },
      },
    ],
    reviews: [],
    specifications: { origin: 'Yemen', roast: 'Medium' },
    createdAt: '2026-06-01T12:00:00.000Z',
    updatedAt: '2026-06-01T12:00:00.000Z',
  },
  {
    id: 'prod-v60-dripper',
    nameAr: 'قمع ترشيح V60 زجاجي',
    nameEn: 'V60 Glass Dripper',
    slug: 'v60-glass-dripper',
    descriptionAr: 'قمع ترشيح زجاجي عالي الجودة لتحضير أفضل كوب قهوة مرشحة.',
    descriptionEn: 'High quality glass dripper to brew the best filtered coffee.',
    price: 85.0,
    images: [
      {
        id: 'v60-dripper-img-0',
        url: '/assets/images/v60-dripper.jpg',
        altAr: 'قمع ترشيح V60 زجاجي',
        altEn: 'V60 Glass Dripper',
        isPrimary: true,
      },
    ],
    categoryId: 'cat-tools',
    category: mockCategories[1],
    sku: 'TOL-V60-002',
    stock: 5,
    weightQuantity: '1 Unit',
    rating: 4.5,
    reviewsCount: 8,
    isActive: true,
    isFeatured: false,
    variants: [
      {
        id: 'prod-v60-dripper-default-var',
        productId: 'prod-v60-dripper',
        nameAr: 'حجم 02',
        nameEn: 'Size 02',
        price: 85.0,
        stock: 5,
        sku: 'TOL-V60-002-02',
        attributes: { size: '02' },
      },
    ],
    specifications: { material: 'Glass', capacity: '1-4 cups' },
    createdAt: '2026-06-02T12:00:00.000Z',
    updatedAt: '2026-06-02T12:00:00.000Z',
  },
];

export const mockCoupons: Coupon[] = [
  {
    id: 'coupon-jnan10',
    code: 'JNAN10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 100,
    maxDiscount: 50,
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2027-01-01T00:00:00.000Z',
    isActive: true,
  },
  {
    id: 'coupon-flat50',
    code: 'FLAT50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 200,
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2027-01-01T00:00:00.000Z',
    isActive: true,
  },
];

export const mockShippingAddress = {
  id: 'addr-123',
  userId: 'usr-mock-123',
  title: 'المنزل',
  addressLine1: 'طريق الملك فهد، حي الملقا',
  addressLine2: 'مبنى 4، شقة 12',
  city: 'الرياض',
  state: 'منطقة الرياض',
  country: 'المملكة العربية السعودية',
  postalCode: '13521',
  isDefault: true,
};

export const mockOrder: Order = {
  id: 'ord-mock-999',
  orderNumber: 'JN-123456',
  userId: 'usr-mock-123',
  items: [
    {
      id: 'ord-item-yemen',
      productId: 'prod-yemen-123',
      productNameAr: 'بن اليمن الهرري',
      productNameEn: 'Yemen Harazi Coffee',
      quantity: 2,
      price: 105.0,
      imageUrl: '/assets/images/yemen-harazi.jpg',
    },
  ],
  shippingAddress: mockShippingAddress,
  subtotal: 210.0,
  discountAmount: 21.0, // 10% coupon applied
  shippingFee: 15.0,
  taxAmount: 28.35, // 15% VAT on (210 - 21) = 189 * 0.15 = 28.35
  totalAmount: 232.35, // 189 + 15 + 28.35 = 232.35
  status: 'pending',
  paymentStatus: 'pending',
  createdAt: '2026-07-04T12:00:00.000Z',
  updatedAt: '2026-07-04T12:00:00.000Z',
};
