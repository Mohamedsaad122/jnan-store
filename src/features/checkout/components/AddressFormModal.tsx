import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { X, MapPin, Globe } from 'lucide-react';
import { Address } from '@/types/domain';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAddress: (data: Omit<Address, 'id' | 'userId'>) => void;
  initialData?: Address | null;
}

export const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitAddress,
  initialData,
}) => {
  const { t } = useTranslation();
  const isRtl = t('common.dir', { defaultValue: 'rtl' }) === 'rtl';

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectedLatLng, setDetectedLatLng] = useState('');

  // 1. Zod Validation Schema
  const addressSchema = z.object({
    title: z
      .string()
      .min(2, t('checkout.validation.title_min', { defaultValue: 'مسمى العنوان مطلوب' })),
    addressLine1: z.string().min(
      5,
      t('checkout.validation.line1_min', {
        defaultValue: 'تفاصيل العنوان مطلوبة (اسم الشارع والمبنى)',
      })
    ),
    addressLine2: z.string().optional(),
    city: z.string().min(2, t('checkout.validation.city_min', { defaultValue: 'المدينة مطلوبة' })),
    state: z.string().optional(),
    country: z
      .string()
      .min(2, t('checkout.validation.country_min', { defaultValue: 'الدولة مطلوبة' })),
    postalCode: z
      .string()
      .regex(
        /^\d{5}$/,
        t('checkout.validation.postal_regex', {
          defaultValue: 'يجب أن يتكون الرمز البريدي من ٥ أرقام',
        })
      )
      .optional()
      .or(z.literal('')),
    isDefault: z.boolean().default(false),
  });

  type AddressFormValues = z.infer<typeof addressSchema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      title: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: 'المملكة العربية السعودية',
      postalCode: '',
      isDefault: false,
    },
  });

  // Populate form values when editing
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        addressLine1: initialData.addressLine1,
        addressLine2: initialData.addressLine2 || '',
        city: initialData.city,
        state: initialData.state || '',
        country: initialData.country,
        postalCode: initialData.postalCode || '',
        isDefault: initialData.isDefault,
      });
      setDetectedLatLng('24.7136° N, 46.6753° E');
    } else {
      reset({
        title: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: 'المملكة العربية السعودية',
        postalCode: '',
        isDefault: false,
      });
      setDetectedLatLng('');
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = (data: AddressFormValues) => {
    onSubmitAddress(data);
    onClose();
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    setTimeout(() => {
      setIsDetectingLocation(false);
      setDetectedLatLng('24.7742° N, 46.7385° E');
      setValue('addressLine1', 'طريق الملك عبد العزيز، حي صلاح الدين، مبنى ٤٨٢');
      setValue('city', 'الرياض');
      setValue('state', 'منطقة الرياض');
      setValue('postalCode', '12434');
      toast.success(
        isRtl
          ? 'تم تحديد موقعك بدقة وتعبئة تفاصيل العنوان تلقائياً!'
          : 'Detected address details autofilled successfully!'
      );
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs font-tajawal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-background border border-border/40 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden text-right flex flex-col mx-4 max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/20">
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted/40 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label={t('checkout.cancel', { defaultValue: 'إلغاء' })}
          >
            <X className="h-4.5 w-4.5" />
          </button>
          <h3 id="modal-title" className="text-sm sm:text-base font-extrabold text-primary">
            {initialData
              ? t('checkout.edit_address', { defaultValue: 'تعديل العنوان' })
              : t('checkout.address_modal_title', { defaultValue: 'بيانات العنوان الجديد' })}
          </h3>
        </div>

        {/* Modal Form Scroll Area */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex-1 overflow-y-auto p-5 space-y-4 select-text"
        >
          {/* Simulated Google Maps Box */}
          <div className="border border-border/40 rounded-xl overflow-hidden bg-muted/20 relative select-none">
            <div className="h-32 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#c4a054_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
              <MapPin className="h-8 w-8 text-gold animate-bounce z-10" />
              <p className="text-[10px] text-muted-foreground mt-1.5 z-10 font-bold">
                {isRtl
                  ? 'خريطة التحديد الجغرافي (محاكاة Google Maps)'
                  : 'Simulated Google Maps View'}
              </p>

              {/* Locate me button */}
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isDetectingLocation}
                className="absolute bottom-2.5 end-2.5 bg-primary text-primary-foreground hover:bg-primary/95 text-[9px] font-black py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-gold border border-gold/10 shrink-0 cursor-pointer"
              >
                {isDetectingLocation ? (
                  <span className="h-2.5 w-2.5 border border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Globe className="h-3 w-3 text-gold" />
                )}
                <span>{isRtl ? 'تحديد موقعي التلقائي' : 'Locate Me'}</span>
              </button>
            </div>
            <div className="bg-muted/10 border-t border-border/20 px-3 py-2 flex items-center justify-between text-[10px] text-muted-foreground select-none">
              <span>GPS Lat/Lng: {detectedLatLng || '24.7136° N, 46.6753° E'}</span>
              <span className="text-gold font-bold">Google Maps API (Mocked)</span>
            </div>
          </div>

          {/* Label Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground">
              {t('checkout.address_title_label', {
                defaultValue: 'مسمى العنوان (مثال: المنزل، العمل)',
              })}
            </label>
            <Input
              type="text"
              placeholder={t('checkout.address_title_label', { defaultValue: 'المنزل' })}
              {...register('title')}
              className="h-10 text-xs px-3 text-right focus-visible:ring-gold"
            />
            {errors.title && (
              <span className="text-[10px] text-destructive font-bold">{errors.title.message}</span>
            )}
          </div>

          {/* Address Line 1 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground">
              {t('checkout.address_line1_label', { defaultValue: 'اسم الشارع ورقم المبنى' })}
            </label>
            <Input
              type="text"
              placeholder="مثال: شارع العليا، مبنى ٢٣٤"
              {...register('addressLine1')}
              className="h-10 text-xs px-3 text-right focus-visible:ring-gold"
            />
            {errors.addressLine1 && (
              <span className="text-[10px] text-destructive font-bold">
                {errors.addressLine1.message}
              </span>
            )}
          </div>

          {/* Address Line 2 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground">
              {t('checkout.address_line2_label', {
                defaultValue: 'الحي، الشقة، أو الجوار (اختياري)',
              })}
            </label>
            <Input
              type="text"
              placeholder="مثال: حي الياسمين، شقة ٥"
              {...register('addressLine2')}
              className="h-10 text-xs px-3 text-right focus-visible:ring-gold"
            />
          </div>

          {/* Grid fields for City & State */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground">
                {t('checkout.address_city_label', { defaultValue: 'المدينة' })}
              </label>
              <Input
                type="text"
                placeholder="الرياض"
                {...register('city')}
                className="h-10 text-xs px-3 text-right focus-visible:ring-gold"
              />
              {errors.city && (
                <span className="text-[10px] text-destructive font-bold">
                  {errors.city.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground">
                {t('checkout.address_state_label', { defaultValue: 'المنطقة / المحافظة' })}
              </label>
              <Input
                type="text"
                placeholder="منطقة الرياض"
                {...register('state')}
                className="h-10 text-xs px-3 text-right focus-visible:ring-gold"
              />
            </div>
          </div>

          {/* Grid fields for Country & Postal Code */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground">
                {t('checkout.address_postal_label', { defaultValue: 'الرمز البريدي (٥ أرقام)' })}
              </label>
              <Input
                type="text"
                placeholder="13315"
                {...register('postalCode')}
                className="h-10 text-xs px-3 text-right font-sans focus-visible:ring-gold"
              />
              {errors.postalCode && (
                <span className="text-[10px] text-destructive font-bold">
                  {errors.postalCode.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground">
                {t('checkout.address_country_label', { defaultValue: 'الدولة' })}
              </label>
              <Input
                type="text"
                {...register('country')}
                className="h-10 text-xs px-3 text-right opacity-80"
                disabled
              />
            </div>
          </div>

          {/* Set Default checkbox */}
          <div className="flex items-center gap-2 select-none border-t border-border/20 pt-4 mt-2">
            <input
              id="isDefault"
              type="checkbox"
              {...register('isDefault')}
              className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold cursor-pointer"
            />
            <label htmlFor="isDefault" className="text-xs font-bold text-primary cursor-pointer">
              {t('checkout.address_default_checkbox', {
                defaultValue: 'تعيين كعنوان افتراضي للشحن',
              })}
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 select-none">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 text-xs px-4 font-bold rounded-lg border-border/60 cursor-pointer"
            >
              {t('checkout.cancel', { defaultValue: 'إلغاء' })}
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="h-10 text-xs px-5 font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg shadow-sm cursor-pointer"
            >
              {t('checkout.save', { defaultValue: 'حفظ العنوان' })}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressFormModal;
