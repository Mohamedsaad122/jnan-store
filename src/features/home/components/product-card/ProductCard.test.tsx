import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@/test/render';
import { screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';
import { mockProducts } from '@/test/fixtures';

const mockAddToCart = vi.fn();
const mockToggleWishlist = vi.fn();
const mockIsInWishlist = vi.fn();

vi.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    addToCart: mockAddToCart,
  }),
}));

vi.mock('@/hooks/useWishlist', () => ({
  useWishlist: () => ({
    toggleWishlist: mockToggleWishlist,
    isInWishlist: mockIsInWishlist,
  }),
}));

describe('ProductCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsInWishlist.mockReturnValue(false);
  });

  it('renders product card details correctly (AR localization)', () => {
    render(<ProductCard product={mockProducts[0]} />);

    expect(screen.getByText(mockProducts[0].nameAr)).toBeInTheDocument();
    // Discount price check
    expect(screen.getByText('١٠٥٫٠٠ ر.س')).toBeInTheDocument();
  });

  it('displays the correct discount badge percentage', () => {
    render(<ProductCard product={mockProducts[0]} />);
    // 120 -> 105 is a 13% discount
    expect(screen.getByText('-١٣٪')).toBeInTheDocument();
  });

  it('triggers addToCart when add-to-cart button is clicked', () => {
    render(<ProductCard product={mockProducts[0]} layout="list" />);

    const addToCartBtn = screen.getByRole('button', { name: 'product.add_to_cart' });
    fireEvent.click(addToCartBtn);

    expect(mockAddToCart).toHaveBeenCalledWith({
      productId: mockProducts[0].id,
      name: mockProducts[0].nameAr,
      price: 105.0,
      imageUrl: mockProducts[0].images[0].url,
    });
  });

  it('toggles wishlist when heart icon button is clicked', () => {
    render(<ProductCard product={mockProducts[0]} />);

    const wishlistBtn = screen.getByRole('button', { name: 'wishlist.add_label' });
    fireEvent.click(wishlistBtn);

    expect(mockToggleWishlist).toHaveBeenCalledWith(mockProducts[0].id);
  });

  it('displays out-of-stock badge when stock is 0', () => {
    const outOfStockProduct = { ...mockProducts[0], stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByText('product.out_of_stock')).toBeInTheDocument();
  });
});
