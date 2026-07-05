import { describe, it, expect, vi } from 'vitest';
import { render } from '@/test/render';
import { screen, fireEvent } from '@testing-library/react';
import OTPInput from './OTPInput';

describe('OTPInput Component', () => {
  it('renders correct number of input boxes', () => {
    render(<OTPInput value="" onChange={() => {}} length={6} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
  });

  it('autofocuses the first input field on mount', () => {
    render(<OTPInput value="" onChange={() => {}} length={6} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveFocus();
  });

  it('calls onChange with correct values when typing digits', () => {
    const handleChange = vi.fn();
    render(<OTPInput value="" onChange={handleChange} length={6} />);
    const inputs = screen.getAllByRole('textbox');

    fireEvent.change(inputs[0], { target: { value: '5' } });
    expect(handleChange).toHaveBeenCalledWith('5');
  });

  it('shifts focus backward on Backspace when empty', () => {
    const handleChange = vi.fn();
    render(<OTPInput value="12" onChange={handleChange} length={6} />);
    const inputs = screen.getAllByRole('textbox');

    // Focus third input box and hit backspace
    inputs[2].focus();
    fireEvent.keyDown(inputs[2], { key: 'Backspace' });
    expect(handleChange).toHaveBeenCalledWith('1');
    expect(inputs[1]).toHaveFocus();
  });

  it('handles paste events correctly', () => {
    const handleChange = vi.fn();
    render(<OTPInput value="" onChange={handleChange} length={6} />);
    const inputs = screen.getAllByRole('textbox');

    const pasteEvent = {
      preventDefault: vi.fn(),
      clipboardData: {
        getData: () => '123456',
      },
    };

    fireEvent.paste(inputs[0], pasteEvent);
    expect(handleChange).toHaveBeenCalledWith('123456');
  });
});
