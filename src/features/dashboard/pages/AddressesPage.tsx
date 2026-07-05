import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit3, ShieldCheck } from 'lucide-react';
import { useAddressStore } from '@/store/address.store';
import { useLanguageStore } from '@/store/language.store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { AddressFormModal } from '@/features/checkout/components/AddressFormModal';
import { Address } from '@/types/domain';
import SectionTitle from '../components/SectionTitle';
import EmptyDashboardState from '../components/EmptyDashboardState';
import { toast } from 'react-hot-toast';

export const AddressesPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const { addresses, addAddress, editAddress, deleteAddress, setDefaultAddress } =
    useAddressStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleSubmitAddress = (data: Omit<Address, 'id' | 'userId'>) => {
    if (editingAddress) {
      editAddress(editingAddress.id, data);
      toast.success(isRtl ? 'تم تحديث العنوان بنجاح' : 'Address updated successfully');
    } else {
      addAddress(data);
      toast.success(isRtl ? 'تمت إضافة العنوان بنجاح' : 'Address added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteAddress(id);
    toast.success(isRtl ? 'تم حذف العنوان بنجاح' : 'Address deleted successfully');
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id);
    toast.success(isRtl ? 'تم تعيين العنوان كافتراضي' : 'Set as default shipping address');
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/10 pb-4 select-none text-right">
        <SectionTitle
          title={t('dashboard.nav.addresses')}
          subtitle={
            isRtl
              ? 'أضف أو عدل عناوين الشحن والتوصيل الافتراضية الخاصة بك.'
              : 'Add, update or manage your default delivery and shipping locations.'
          }
        />

        <Button
          onClick={handleOpenAddModal}
          size="sm"
          className="text-xs font-bold gap-2 bg-primary text-primary-foreground self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{isRtl ? 'إضافة عنوان جديد' : 'Add New Address'}</span>
        </Button>
      </div>

      {/* Address Cards List */}
      {addresses.length === 0 ? (
        <EmptyDashboardState
          title={isRtl ? 'لا يوجد عناوين مسجلة' : 'No saved shipping addresses'}
          description={
            isRtl
              ? 'لم تقم بإضافة أي عناوين شحن بعد. اضغط على الزر أعلاه لإضافة عنوانك الأول.'
              : 'No saved shipping addresses found. Click the button above to add one.'
          }
          actionText={isRtl ? 'إضافة عنوان جديد' : 'Add New Address'}
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <Card
              key={addr.id}
              className={`p-5 border flex flex-col justify-between text-right relative overflow-hidden transition-all ${
                addr.isDefault
                  ? 'border-gold bg-gold/5 shadow-xs'
                  : 'border-border/40 hover:border-border shadow-xs'
              }`}
            >
              <div className="space-y-3">
                {/* Title badge & actions */}
                <div className="flex items-start justify-between gap-2 select-none">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-primary">{addr.title}</span>
                    {addr.isDefault && (
                      <span className="bg-gold/15 text-gold text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{isRtl ? 'الافتراضي للشحن' : 'Default'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {addr.addressLine1}
                  {addr.addressLine2 && `، ${addr.addressLine2}`}
                  <br />
                  {addr.city}، {addr.state}
                  <br />
                  {addr.country}
                  {addr.postalCode && `، ${isRtl ? 'الرمز البريدي:' : 'ZIP:'} ${addr.postalCode}`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/20 pt-4 mt-4 select-none">
                {!addr.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] font-bold text-muted-foreground hover:text-primary"
                    onClick={() => handleSetDefault(addr.id)}
                  >
                    {isRtl ? 'تعيين كافتراضي' : 'Set as Default'}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="text-[10px] font-bold gap-1 border-border/40"
                  onClick={() => handleOpenEditModal(addr)}
                  aria-label={isRtl ? `تعديل عنوان ${addr.title}` : `Edit address ${addr.title}`}
                >
                  <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[10px] font-bold gap-1 text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(addr.id)}
                  aria-label={isRtl ? `حذف عنوان ${addr.title}` : `Delete address ${addr.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{isRtl ? 'حذف' : 'Delete'}</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Form modal */}
      {isModalOpen && (
        <AddressFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmitAddress={handleSubmitAddress}
          initialData={editingAddress}
        />
      )}
    </div>
  );
};

export default AddressesPage;
