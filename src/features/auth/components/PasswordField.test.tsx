import { describe, it, expect } from 'vitest';
import { render } from '@/test/render';
import { screen, fireEvent } from '@testing-library/react';
import PasswordField from './PasswordField';

describe('PasswordField Component', () => {
  it('renders input with password type by default', () => {
    render(<PasswordField placeholder="أدخل كلمة المرور" />);
    const input = screen.getByPlaceholderText('أدخل كلمة المرور');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles input type when visibility button is clicked', () => {
    render(<PasswordField placeholder="أدخل كلمة المرور" />);
    const input = screen.getByPlaceholderText('أدخل كلمة المرور');
    const toggleButton = screen.getByRole('button', { name: 'إظهار كلمة المرور' });

    // Show password
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'إخفاء كلمة المرور' })).toBeInTheDocument();

    // Hide password
    fireEvent.click(screen.getByRole('button', { name: 'إخفاء كلمة المرور' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('renders error helper text when error is passed', () => {
    render(<PasswordField placeholder="أدخل كلمة المرور" error="كلمة المرور قصيرة جداً" />);
    expect(screen.getByText('كلمة المرور قصيرة جداً')).toBeInTheDocument();
  });
});
