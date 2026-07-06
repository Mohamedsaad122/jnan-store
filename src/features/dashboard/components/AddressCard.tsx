import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Edit3, ShieldCheck } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Address } from '@/types/domain';

interface AddressCardProps {
  address: Address;
  onEdit: (addr: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isRtl: boolean;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isRtl,
}) => {
  const { t } = useTranslation();

  return (
    <Card
      className={`p-5 border flex flex-col justify-between text-right relative overflow-hidden transition-all font-tajawal shadow-xs ${
        address.isDefault
          ? 'border-gold bg-gold/5 shadow-xs'
          : 'border-border/40 hover:border-border/60'
      }`}
    >
      <div className="space-y-3">
        {/* Title badge & actions */}
        <div className="flex items-start justify-between gap-2 select-none">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-primary">{address.title}</span>
            {address.isDefault && (
              <span className="bg-gold/15 text-gold text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-gold/10">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{t('addresses.default_label', 'الافتراضي للشحن')}</span>
              </span>
            )}
          </div>
        </div>

        {/* Address Lines */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {address.addressLine1}
          {address.addressLine2 && `، ${address.addressLine2}`}
          <br />
          {address.city}، {address.state}
          <br />
          {address.country}
          {address.postalCode && `، ${isRtl ? 'الرمز البريدي:' : 'ZIP:'} ${address.postalCode}`}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/10 pt-4 mt-4 select-none">
        {!address.isDefault && (
          <Button
            variant="ghost"
            size="sm"
            className="text-[10px] font-bold text-muted-foreground hover:text-primary"
            onClick={() => onSetDefault(address.id)}
          >
            {t('addresses.set_default', 'تعيين كافتراضي')}
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="text-[10px] font-bold gap-1 border-border/40"
          onClick={() => onEdit(address)}
          aria-label={isRtl ? `تعديل عنوان ${address.title}` : `Edit address ${address.title}`}
        >
          <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{t('common.edit', 'تعديل')}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-[10px] font-bold gap-1 text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(address.id)}
          aria-label={isRtl ? `حذف عنوان ${address.title}` : `Delete address ${address.title}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{t('common.delete', 'حذف')}</span>
        </Button>
      </div>
    </Card>
  );
};

export default AddressCard;
