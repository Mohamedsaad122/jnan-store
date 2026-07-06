import React from 'react';
import { Address } from '@/types/domain';
import AddressCard from './AddressCard';
import EmptyAddressState from './EmptyAddressState';

interface AddressListProps {
  addresses: Address[];
  onEdit: (addr: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  onAddAddress: () => void;
  isRtl: boolean;
}

export const AddressList: React.FC<AddressListProps> = ({
  addresses,
  onEdit,
  onDelete,
  onSetDefault,
  onAddAddress,
  isRtl,
}) => {
  if (addresses.length === 0) {
    return <EmptyAddressState onAddAddress={onAddAddress} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {addresses.map((addr) => (
        <AddressCard
          key={addr.id}
          address={addr}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
          isRtl={isRtl}
        />
      ))}
    </div>
  );
};

export default AddressList;
