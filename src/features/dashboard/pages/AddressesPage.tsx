import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { useLanguageStore } from '@/store/language.store';
import Button from '@/components/ui/Button';
import { AddressFormModal } from '@/features/checkout/components/AddressFormModal';
import { Address } from '@/types/domain';
import SectionHeader from '../components/SectionHeader';
import AddressList from '../components/AddressList';
import {
  useAddresses,
  useAddAddress,
  useEditAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '@/hooks/useAddressesQuery';
import LoadingSpinner from '@/components/LoadingSpinner';

export const AddressesPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const { data: addresses = [], isLoading } = useAddresses();
  const addAddressMutation = useAddAddress();
  const editAddressMutation = useEditAddress();
  const deleteAddressMutation = useDeleteAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();

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
      editAddressMutation.mutate({ id: editingAddress.id, updatedFields: data });
    } else {
      addAddressMutation.mutate(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteAddressMutation.mutate(id);
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddressMutation.mutate(id);
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Contextual Header */}
      <SectionHeader
        title={t('dashboard.nav.addresses', 'عناوين الشحن')}
        subtitle={
          isRtl
            ? 'أضف أو عدل عناوين الشحن والتوصيل الافتراضية الخاصة بك.'
            : 'Add, update or manage your default delivery and shipping locations.'
        }
      >
        <Button
          onClick={handleOpenAddModal}
          size="sm"
          className="text-xs font-bold gap-1 bg-primary text-primary-foreground focus-visible:ring-gold"
        >
          <Plus className="h-4 w-4" />
          <span>{isRtl ? 'إضافة عنوان جديد' : 'Add New Address'}</span>
        </Button>
      </SectionHeader>

      {/* Loading state indicator */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        /* Address Cards List */
        <AddressList
          addresses={addresses}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
          onAddAddress={handleOpenAddModal}
          isRtl={isRtl}
        />
      )}

      {/* Reusable Form Modal */}
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
