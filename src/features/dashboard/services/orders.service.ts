import { Order } from '@/types/domain';
import { featureFlags } from '@/config/featureFlags';
import { request } from '@/lib/api/request';

const PRESET_ORDERS: Order[] = [
  {
    id: 'ord-preset-1',
    orderNumber: 'JN-928374',
    userId: 'mock-user-123',
    items: [
      {
        id: 'oi-1',
        productId: 'prod-1',
        productNameAr: 'عسل السدر الفاخر',
        productNameEn: 'Premium Sidr Honey',
        quantity: 2,
        price: 150,
        imageUrl: '',
      },
      {
        id: 'oi-2',
        productId: 'prod-3',
        productNameAr: 'تمور خلاص الأحساء',
        productNameEn: 'Al-Ahsa Khalas Dates',
        quantity: 1,
        price: 45,
        imageUrl: '',
      },
    ],
    shippingAddress: {
      id: 'addr-riyadh-home',
      userId: 'mock-user-123',
      title: 'المنزل (الرياض)',
      addressLine1: 'شارع العليا العام، حي الياسمين',
      city: 'الرياض',
      state: 'منطقة الرياض',
      country: 'المملكة العربية السعودية',
      postalCode: '13315',
      isDefault: true,
    },
    subtotal: 345,
    discountAmount: 0,
    shippingFee: 15,
    taxAmount: 51.75,
    totalAmount: 411.75,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2026-06-15T14:30:00Z',
    updatedAt: '2026-06-17T18:00:00Z',
  },
  {
    id: 'ord-preset-2',
    orderNumber: 'JN-108273',
    userId: 'mock-user-123',
    items: [
      {
        id: 'oi-3',
        productId: 'prod-2',
        productNameAr: 'سمن بري طبيعي',
        productNameEn: 'Natural Ghee',
        quantity: 1,
        price: 85,
        imageUrl: '',
      },
    ],
    shippingAddress: {
      id: 'addr-riyadh-home',
      userId: 'mock-user-123',
      title: 'المنزل (الرياض)',
      addressLine1: 'شارع العليا العام، حي الياسمين',
      city: 'الرياض',
      state: 'منطقة الرياض',
      country: 'المملكة العربية السعودية',
      postalCode: '13315',
      isDefault: true,
    },
    subtotal: 85,
    discountAmount: 10,
    shippingFee: 15,
    taxAmount: 11.25,
    totalAmount: 101.25,
    status: 'processing',
    paymentStatus: 'paid',
    createdAt: '2026-07-03T09:15:00Z',
    updatedAt: '2026-07-03T10:00:00Z',
  },
];

/**
 * Service to manage retrieval and storage of dashboard orders.
 * Supports switching between Mock and Real APIs.
 */
export const dashboardOrdersService = {
  /**
   * Fetches mock orders for a specific user ID, or requests live API endpoints.
   */
  async getOrders(userId: string): Promise<Order[]> {
    if (!featureFlags.enableMockApi) {
      return request.get<Order[]>('/orders', { params: { userId } });
    }

    // Simulate slight network roundtrip
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

  /**
   * Fetches details of a specific order by its unique ID.
   */
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
