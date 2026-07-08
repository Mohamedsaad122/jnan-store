import { Order } from '@/types/domain';
import { featureFlags } from '@/config/featureFlags';
import { request } from '@/lib/api/request';

const PRESET_ORDERS: Order[] = [
  {
    id: 'ord-preset-1',
    orderNumber: 'JN-928374',
    userId: 'usr-jnan-customer',
    items: [
      {
        id: 'oi-1',
        productId: 'prod-1',
        productNameAr: 'قهوة خولانية فاخرة - حمصة وسط',
        productNameEn: 'Premium Khawlani Coffee - Medium Roast',
        quantity: 2,
        price: 75.0,
        imageUrl:
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=200&auto=format&fit=crop',
      },
      {
        id: 'oi-2',
        productId: 'prod-3',
        productNameAr: 'تمور خلاص الأحساء الملكي',
        productNameEn: 'Royal Al-Ahsa Khalas Dates',
        quantity: 1,
        price: 45.0,
        imageUrl:
          'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=200&auto=format&fit=crop',
      },
    ],
    shippingAddress: {
      id: 'addr-riyadh-home',
      userId: 'usr-jnan-customer',
      title: 'المنزل (الرياض)',
      addressLine1: 'شارع العليا العام، حي الياسمين',
      city: 'الرياض',
      state: 'منطقة الرياض',
      country: 'المملكة العربية السعودية',
      postalCode: '13315',
      isDefault: true,
    },
    subtotal: 195.0,
    discountAmount: 15.0,
    shippingFee: 0.0, // Free shipping for orders >= 200 (pre-discount subtotal is 195, wait, discount makes it 180, let's keep shipping free)
    taxAmount: 27.0, // 15% VAT on 180 (195 - 15)
    totalAmount: 207.0,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'mada',
    shippingMethod: {
      id: 'sm-express',
      nameAr: 'شحن جنان السريع',
      nameEn: 'Jnan Express Shipping',
      descriptionAr: 'توصيل سريع لباب المنزل',
      descriptionEn: 'Fast doorstep delivery',
      cost: 0,
      estimatedDeliveryAr: 'خلال ٢٤ ساعة',
      estimatedDeliveryEn: 'Within 24 hours',
    },
    trackingNumber: 'JN-TRK-928374',
    createdAt: '2026-06-15T14:30:00Z',
    updatedAt: '2026-06-16T18:00:00Z',
  },
  {
    id: 'ord-preset-2',
    orderNumber: 'JN-108273',
    userId: 'usr-jnan-customer',
    items: [
      {
        id: 'oi-3',
        productId: 'prod-2',
        productNameAr: 'قهوة هرري أثيوبية درجة أولى',
        productNameEn: 'Ethiopian Harar Coffee - Grade 1',
        quantity: 1,
        price: 85.0,
        imageUrl:
          'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=200&auto=format&fit=crop',
      },
    ],
    shippingAddress: {
      id: 'addr-riyadh-home',
      userId: 'usr-jnan-customer',
      title: 'المنزل (الرياض)',
      addressLine1: 'شارع العليا العام، حي الياسمين',
      city: 'الرياض',
      state: 'منطقة الرياض',
      country: 'المملكة العربية السعودية',
      postalCode: '13315',
      isDefault: true,
    },
    subtotal: 85.0,
    discountAmount: 0.0,
    shippingFee: 15.0,
    taxAmount: 15.0, // 15% VAT on 100 (85 sub + 15 shipping)
    totalAmount: 115.0,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'applepay',
    shippingMethod: {
      id: 'sm-standard',
      nameAr: 'الشحن البري القياسي',
      nameEn: 'Standard Ground Shipping',
      descriptionAr: 'توصيل لباب المنزل عبر ناقل إكسبريس',
      descriptionEn: 'Doorstep delivery via Naqel Express',
      cost: 15,
      estimatedDeliveryAr: '٣-٥ أيام عمل',
      estimatedDeliveryEn: '3-5 business days',
    },
    trackingNumber: 'JN-TRK-108273',
    createdAt: '2026-07-06T09:15:00Z',
    updatedAt: '2026-07-06T10:00:00Z',
  },
  {
    id: 'ord-preset-3',
    orderNumber: 'JN-304918',
    userId: 'usr-jnan-customer',
    items: [
      {
        id: 'oi-4',
        productId: 'prod-4',
        productNameAr: 'قهوة خولانية حمصة غامقة',
        productNameEn: 'Khawlani Coffee - Dark Roast',
        quantity: 1,
        price: 75.0,
        imageUrl:
          'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=200&auto=format&fit=crop',
      },
    ],
    shippingAddress: {
      id: 'addr-riyadh-home',
      userId: 'usr-jnan-customer',
      title: 'المنزل (الرياض)',
      addressLine1: 'شارع العليا العام، حي الياسمين',
      city: 'الرياض',
      state: 'منطقة الرياض',
      country: 'المملكة العربية السعودية',
      postalCode: '13315',
      isDefault: true,
    },
    subtotal: 75.0,
    discountAmount: 10.0,
    shippingFee: 15.0,
    taxAmount: 12.0, // 15% VAT on 80 (75 - 10 + 15)
    totalAmount: 92.0,
    status: 'cancelled',
    paymentStatus: 'pending',
    paymentMethod: 'cod',
    shippingMethod: {
      id: 'sm-standard',
      nameAr: 'الشحن القياسي',
      nameEn: 'Standard Shipping',
      descriptionAr: 'توصيل لباب المنزل',
      descriptionEn: 'Doorstep delivery',
      cost: 15,
      estimatedDeliveryAr: '٣-٥ أيام عمل',
      estimatedDeliveryEn: '3-5 business days',
    },
    createdAt: '2026-07-01T11:00:00Z',
    updatedAt: '2026-07-01T11:15:00Z',
  },
];

export const dashboardOrdersService = {
  async getOrders(userId: string): Promise<Order[]> {
    if (!featureFlags.enableMockApi) {
      return request.get<Order[]>('/orders', { params: { userId } });
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const list = [...PRESET_ORDERS];
    const lastOrderStr = localStorage.getItem('jnan_last_order');
    if (lastOrderStr) {
      try {
        const lastOrder = JSON.parse(lastOrderStr) as Order;
        if (lastOrder && lastOrder.userId === userId && !list.some((o) => o.id === lastOrder.id)) {
          list.unshift(lastOrder);
        }
      } catch {
        // Ignore JSON format errors
      }
    }
    return list;
  },

  async getOrderById(orderId: string): Promise<Order | undefined> {
    if (!featureFlags.enableMockApi) {
      return request.get<Order>(`/orders/${orderId}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    const allOrders = [...PRESET_ORDERS];
    const lastOrderStr = localStorage.getItem('jnan_last_order');
    if (lastOrderStr) {
      try {
        const lastOrder = JSON.parse(lastOrderStr) as Order;
        if (lastOrder && !allOrders.some((o) => o.id === lastOrder.id)) {
          allOrders.unshift(lastOrder);
        }
      } catch {
        // Ignore JSON format errors
      }
    }
    return allOrders.find((o) => o.id === orderId);
  },
};

export default dashboardOrdersService;
