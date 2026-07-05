import { describe, it, expect, vi } from 'vitest';
import { render } from '@/test/render';
import { screen, fireEvent } from '@testing-library/react';
import QuantitySelector from './QuantitySelector';

describe('QuantitySelector Component', () => {
  it('renders correctly with given quantity', () => {
    render(<QuantitySelector quantity={3} stock={5} onChange={() => {}} />);
    expect(screen.getByText('٣')).toBeInTheDocument();
  });

  it('calls onChange with quantity + 1 when plus button is clicked', () => {
    const handleChange = vi.fn();
    render(<QuantitySelector quantity={3} stock={5} onChange={handleChange} />);
    const plusButton = screen.getByRole('button', { name: 'زيادة الكمية' });

    fireEvent.click(plusButton);
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('calls onChange with quantity - 1 when minus button is clicked', () => {
    const handleChange = vi.fn();
    render(<QuantitySelector quantity={3} stock={5} onChange={handleChange} />);
    const minusButton = screen.getByRole('button', { name: 'تقليل الكمية' });

    fireEvent.click(minusButton);
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it('disables the minus button when quantity is 1', () => {
    render(<QuantitySelector quantity={1} stock={5} onChange={() => {}} />);
    const minusButton = screen.getByRole('button', { name: 'تقليل الكمية' });
    expect(minusButton).toBeDisabled();
  });

  it('disables the plus button when quantity matches stock limit', () => {
    render(<QuantitySelector quantity={5} stock={5} onChange={() => {}} />);
    const plusButton = screen.getByRole('button', { name: 'زيادة الكمية' });
    expect(plusButton).toBeDisabled();
  });

  it('respects the disabled prop globally', () => {
    render(<QuantitySelector quantity={3} stock={5} onChange={() => {}} disabled />);
    const groupElement = screen.getByRole('group');
    expect(groupElement).toHaveClass('opacity-50');
  });
});
