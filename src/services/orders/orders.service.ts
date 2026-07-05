import { Order, Address, ShippingMethod, PaymentMethodType } from '@/types/domain';

export interface CreateOrderParams {
  items: Order['items'];
  shippingAddress: Address;
  billingAddress?: Address;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethodType;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string;
}

/**
 * Service to manage checkout order submissions, data validation, and calculations.
 */
export const ordersService = {
  /**
   * Mock creation of a customer order, simulating network latency
   */
  async createOrder(orderData: CreateOrderParams): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulating gateway roundtrip

    const orderNumber = `JN-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: 'mock-user-123',
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newOrder;
  },

  /**
   * Performs client-side validations on checkout options
   */
  validateCheckout(checkoutData: {
    shippingAddress?: Address;
    shippingMethod?: ShippingMethod;
    paymentMethod?: PaymentMethodType;
    itemsCount: number;
  }) {
    const errors: string[] = [];

    if (checkoutData.itemsCount === 0) {
      errors.push('السلة فارغة. يرجى إضافة منتجات لإتمام الطلب.');
    }
    if (!checkoutData.shippingAddress) {
      errors.push('يرجى تحديد أو إضافة عنوان الشحن.');
    }
    if (!checkoutData.shippingMethod) {
      errors.push('يرجى اختيار طريقة الشحن.');
    }
    if (!checkoutData.paymentMethod) {
      errors.push('يرجى اختيار طريقة الدفع.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Dynamic totals calculator reusing store params
   */
  calculateTotals(subtotal: number, discountAmount: number, shippingFee: number) {
    const netAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = netAmount * 0.15; // Saudi VAT 15%
    const totalAmount = netAmount + shippingFee + taxAmount;

    return {
      subtotal,
      discountAmount,
      shippingFee,
      taxAmount,
      totalAmount,
    };
  },
};

export default ordersService;
