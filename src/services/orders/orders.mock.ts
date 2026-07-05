import { PaymentMethodType } from '@/types/domain';

export interface MockShippingMethodRecord {
  id: string;
  nameKey: string;
  nameAr: string;
  nameEn: string;
  descKey: string;
  descriptionAr: string;
  descriptionEn: string;
  cost: number;
  estimatedDeliveryAr: string;
  estimatedDeliveryEn: string;
}

export interface MockPaymentMethodRecord {
  id: PaymentMethodType;
  nameKey: string;
  nameAr: string;
  nameEn: string;
  descKey: string;
  descriptionAr: string;
  descriptionEn: string;
  iconName: 'wallet' | 'creditcard' | 'banknote';
}

export const MOCK_SHIPPING_METHODS: MockShippingMethodRecord[] = [
  {
    id: 'sm-standard',
    nameKey: 'checkout.standard_shipping',
    nameAr: 'شحن قياسي',
    nameEn: 'Standard Shipping',
    descKey: 'checkout.standard_shipping_desc',
    descriptionAr: 'توصيل خلال ٣-٥ أيام عمل',
    descriptionEn: 'Delivery within 3-5 business days',
    cost: 15,
    estimatedDeliveryAr: '٣ - ٥ أيام عمل',
    estimatedDeliveryEn: '3 - 5 business days',
  },
  {
    id: 'sm-express',
    nameKey: 'checkout.express_shipping',
    nameAr: 'شحن سريع',
    nameEn: 'Express Shipping',
    descKey: 'checkout.express_shipping_desc',
    descriptionAr: 'توصيل خلال ١-٢ يوم عمل',
    descriptionEn: 'Delivery within 1-2 business days',
    cost: 25,
    estimatedDeliveryAr: '١ - ٢ يوم عمل',
    estimatedDeliveryEn: '1 - 2 business days',
  },
  {
    id: 'sm-sameday',
    nameKey: 'checkout.sameday_shipping',
    nameAr: 'توصيل في نفس اليوم',
    nameEn: 'Same Day Delivery',
    descKey: 'checkout.sameday_shipping_desc',
    descriptionAr: 'خاص بمدينة الرياض ومحيطها',
    descriptionEn: 'Available for Riyadh city limits only',
    cost: 40,
    estimatedDeliveryAr: 'خلال اليوم (الرياض فقط)',
    estimatedDeliveryEn: 'Today (Riyadh only)',
  },
];

export const MOCK_PAYMENT_METHODS: MockPaymentMethodRecord[] = [
  {
    id: 'mada',
    nameKey: 'checkout.mada',
    nameAr: 'بطاقة مدى البنكية',
    nameEn: 'Mada Debit Card',
    descKey: 'checkout.mada_desc',
    descriptionAr: 'دفع فوري آمن ومباشر',
    descriptionEn: 'Secure instant direct payment',
    iconName: 'wallet',
  },
  {
    id: 'applepay',
    nameKey: 'checkout.applepay',
    nameAr: 'Apple Pay',
    nameEn: 'Apple Pay',
    descKey: 'checkout.applepay_desc',
    descriptionAr: 'الدفع الآمن بلمسة واحدة',
    descriptionEn: 'One-touch secure payment',
    iconName: 'creditcard',
  },
  {
    id: 'card',
    nameKey: 'checkout.card',
    nameAr: 'بطاقة ائتمانية',
    nameEn: 'Credit Card',
    descKey: 'checkout.card_desc',
    descriptionAr: 'فيزا، ماستركارد، أمريكان إكسبريس',
    descriptionEn: 'Visa, Mastercard, AMEX',
    iconName: 'creditcard',
  },
  {
    id: 'stcpay',
    nameKey: 'checkout.stcpay',
    nameAr: 'STC Pay',
    nameEn: 'STC Pay',
    descKey: 'checkout.stcpay_desc',
    descriptionAr: 'الدفع من محفظة STC Pay الرقمية',
    descriptionEn: 'Payment via STC Pay digital wallet',
    iconName: 'wallet',
  },
  {
    id: 'cod',
    nameKey: 'checkout.cod',
    nameAr: 'الدفع عند الاستلام',
    nameEn: 'Cash on Delivery',
    descKey: 'checkout.cod_desc',
    descriptionAr: 'قد تنطبق رسوم تحصيل إضافية',
    descriptionEn: 'Additional fees may apply',
    iconName: 'banknote',
  },
];
