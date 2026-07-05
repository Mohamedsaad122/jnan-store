import { describe, it, expect, vi } from 'vitest';
import { render } from '@/test/render';
import { screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>اضغط هنا</Button>);
    expect(screen.getByRole('button', { name: 'اضغط هنا' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>اضغط هنا</Button>);
    const button = screen.getByRole('button', { name: 'اضغط هنا' });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>اضغط هنا</Button>);
    const button = screen.getByRole('button', { name: 'اضغط هنا' });
    expect(button).toBeDisabled();
  });

  it('shows loading spinner and is disabled when isLoading is true', () => {
    render(<Button isLoading>ارسل</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).toHaveClass('animate-spin');
  });

  it('applies classes for variants correctly', () => {
    const { rerender } = render(<Button variant="primary">زر</Button>);
    let button = screen.getByRole('button', { name: 'زر' });
    expect(button).toHaveClass('bg-primary');

    rerender(<Button variant="outline">زر</Button>);
    button = screen.getByRole('button', { name: 'زر' });
    expect(button).toHaveClass('border-input');
  });
});
