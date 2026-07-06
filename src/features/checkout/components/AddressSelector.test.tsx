import { describe, it, expect, vi } from 'vitest';
import { render } from '@/test/render';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { AddressSelector } from './AddressSelector';

const mockAddresses = [
  {
    id: 'addr-1',
    userId: 'usr-mock-123',
    title: 'المنزل',
    addressLine1: 'الملقا، الرياض',
    city: 'الرياض',
    country: 'المملكة العربية السعودية',
    isDefault: true,
  },
  {
    id: 'addr-2',
    userId: 'usr-mock-123',
    title: 'العمل',
    addressLine1: 'العليا، الرياض',
    city: 'الرياض',
    country: 'المملكة العربية السعودية',
    isDefault: false,
  },
];

const mockDeleteAddress = vi.fn();
const mockAddAddress = vi.fn();
const mockEditAddress = vi.fn();

vi.mock('@/hooks/useAddressesQuery', () => ({
  useAddresses: () => ({ data: mockAddresses, isLoading: false }),
  useAddAddress: () => ({ mutate: mockAddAddress, isPending: false }),
  useEditAddress: () => ({ mutate: mockEditAddress, isPending: false }),
  useDeleteAddress: () => ({ mutate: mockDeleteAddress, isPending: false }),
}));

// Mock AddressFormModal to avoid rendering complex nested forms in unit test
vi.mock('./AddressFormModal', () => ({
  default: () => <div data-testid="mock-address-form-modal">Mock Address Form Modal</div>,
  AddressFormModal: () => <div data-testid="mock-address-form-modal">Mock Address Form Modal</div>,
}));

describe('AddressSelector Component', () => {
  it('renders title and addresses correctly', () => {
    render(<AddressSelector title="عنوان الشحن" onSelect={() => {}} selectedId="addr-1" />);
    expect(screen.getByText('عنوان الشحن')).toBeInTheDocument();
    expect(screen.getByText('المنزل')).toBeInTheDocument();
    expect(screen.getByText('العمل')).toBeInTheDocument();
  });

  it('triggers onSelect when an address is clicked', () => {
    const handleSelect = vi.fn();
    render(<AddressSelector title="عنوان الشحن" onSelect={handleSelect} selectedId="addr-1" />);

    const workAddress = screen.getByText('العمل').closest('[role="radio"]');
    if (!workAddress) throw new Error('Work address item not found');
    fireEvent.click(workAddress);
    expect(handleSelect).toHaveBeenCalledWith(mockAddresses[1]);
  });

  it('supports selecting address via Enter key', () => {
    const handleSelect = vi.fn();
    render(<AddressSelector title="عنوان الشحن" onSelect={handleSelect} selectedId="addr-1" />);

    const workAddress = screen.getByText('العمل').closest('[role="radio"]');
    if (!workAddress) throw new Error('Work address item not found');

    fireEvent.keyDown(workAddress, { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledWith(mockAddresses[1]);
  });

  it('calls deleteAddress from store when delete button is clicked', () => {
    render(<AddressSelector title="عنوان الشحن" onSelect={() => {}} selectedId="addr-1" />);

    const deleteButtons = screen.getAllByRole('button', { name: 'حذف العنوان' });
    fireEvent.click(deleteButtons[1]); // Delete work address
    expect(mockDeleteAddress).toHaveBeenCalledWith('addr-2');
  });

  it('automatically selects default address on mount if selectedId is empty', async () => {
    const handleSelect = vi.fn();
    render(<AddressSelector title="عنوان الشحن" onSelect={handleSelect} />);

    await waitFor(() => {
      expect(handleSelect).toHaveBeenCalledWith(mockAddresses[0]);
    });
  });
});
