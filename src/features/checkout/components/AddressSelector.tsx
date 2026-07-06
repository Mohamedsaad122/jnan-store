import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, CheckCircle2, MapPin } from 'lucide-react';
import { Address } from '@/types/domain';
import {
  useAddresses,
  useAddAddress,
  useEditAddress,
  useDeleteAddress,
} from '@/hooks/useAddressesQuery';
import AddressFormModal from './AddressFormModal';
import Button from '@/components/ui/Button';

interface AddressSelectorProps {
  selectedId?: string;
  onSelect: (address: Address) => void;
  title: string;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  selectedId,
  onSelect,
  title,
}) => {
  const { t } = useTranslation();

  const { data: addresses = [] } = useAddresses();
  const addAddressMutation = useAddAddress();
  const editAddressMutation = useEditAddress();
  const deleteAddressMutation = useDeleteAddress();

  // State to manage Modal visibility and active edit targets
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Address | null>(null);

  const handleOpenAddModal = () => {
    setEditTarget(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr: Address, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card selection
    setEditTarget(addr);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAddressMutation.mutate(id);
  };

  const handleSaveAddress = (data: Omit<Address, 'id' | 'userId'>) => {
    if (editTarget) {
      editAddressMutation.mutate({ id: editTarget.id, updatedFields: data });
    } else {
      addAddressMutation.mutate(data);
    }
  };

  return (
    <div className="w-full flex flex-col font-tajawal text-right select-none">
      <div className="flex items-center justify-between mb-4 border-b border-border/20 pb-2.5">
        <Button
          type="button"
          onClick={handleOpenAddModal}
          variant="outline"
          className="h-8 text-xs font-bold text-gold border-gold/45 hover:bg-gold/5 flex items-center gap-1 px-2.5 rounded-lg transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{t('checkout.add_address', { defaultValue: 'عنوان جديد' })}</span>
        </Button>

        <h4 className="text-sm font-extrabold text-primary flex items-center gap-1.5 justify-start">
          <MapPin className="h-4 w-4 text-gold" />
          <span>{title}</span>
        </h4>
      </div>

      {addresses.length === 0 ? (
        <div className="border border-dashed border-border/50 p-6 rounded-xl text-center text-xs text-muted-foreground">
          {t('checkout.no_addresses', { defaultValue: 'لم تقم بإضافة أي عناوين شحن بعد.' })}
        </div>
      ) : (
        /* Address selection grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="radiogroup">
          {addresses.map((addr) => {
            const isSelected = selectedId === addr.id;

            // Automatically select address if it's default and no select is set
            if (!selectedId && addr.isDefault) {
              // Trigger option select on load
              setTimeout(() => onSelect(addr), 0);
            }

            return (
              <div
                key={addr.id}
                onClick={() => onSelect(addr)}
                className={`relative p-4 border rounded-xl bg-card/10 hover:bg-muted/10 cursor-pointer flex flex-col justify-between transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold ${
                  isSelected
                    ? 'border-gold shadow-xs ring-1 ring-gold bg-gold/5'
                    : 'border-border/60 hover:border-gold/30'
                }`}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(addr);
                  }
                }}
              >
                {/* Checked tag */}
                {isSelected && (
                  <span className="absolute top-3 left-3 text-gold">
                    <CheckCircle2 className="h-4 w-4 fill-gold text-background" />
                  </span>
                )}

                {/* Info Text */}
                <div className="space-y-1.5 text-right select-text pr-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-primary">{addr.title}</span>
                    {addr.isDefault && (
                      <span className="bg-gold/15 text-gold-foreground border border-gold/10 px-1.5 py-0.2 rounded-md text-[9px] font-bold select-none">
                        {t('checkout.default_label', { defaultValue: 'افتراضي' })}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground/90 leading-relaxed font-medium">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `، ${addr.addressLine2}` : ''}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-sans">
                    {addr.city}، {addr.state}، {addr.country}{' '}
                    {addr.postalCode ? `(${addr.postalCode})` : ''}
                  </p>
                </div>

                {/* Edit and Delete actions */}
                <div className="flex items-center justify-end gap-2 border-t border-border/20 pt-2.5 mt-3 select-none">
                  <button
                    onClick={(e) => handleOpenEditModal(addr, e)}
                    className="p-1 text-muted-foreground hover:text-gold hover:bg-gold/5 rounded-md transition-colors"
                    aria-label="تعديل العنوان"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(addr.id, e)}
                    className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-md transition-colors"
                    aria-label="حذف العنوان"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Address Form Popup Modal */}
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitAddress={handleSaveAddress}
        initialData={editTarget}
      />
    </div>
  );
};

export default AddressSelector;
