export const formatCurrency = (amount: number, locale: 'ar' | 'en' = 'ar'): string => {
  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return locale === 'ar' ? `${formatted} ر.س` : `SAR ${formatted}`;
};

export default formatCurrency;
