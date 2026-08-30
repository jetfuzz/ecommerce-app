import { describe, expect, it, vi } from 'vitest';
import { createMockProduct } from '../../tests/mocks';
import type { CartItem } from '../../types';
import { useOutletContext } from 'react-router';
import { render, screen } from '@testing-library/react';
import CartPage from './CartPage';

const mockCart: CartItem[] = [
  {
    product: createMockProduct({
      id: 4,
      title: 'Snowboard Jacket',
      price: 56.99,
      category: "women's clothing",
    }),
    quantity: 2,
  },
];

vi.mock('react-router', () => ({
  useOutletContext: vi.fn(),
}));

describe('CartPage', () => {
  it('should render all cart items with name and quantity', () => {
    vi.mocked(useOutletContext).mockReturnValue({
      cart: mockCart,
      updateQuantity: vi.fn(),
      removeFromCart: vi.fn(),
    });
    render(<CartPage />);

    expect(screen.getByText('Snowboard Jacket')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should calculate subtotal, total, and tax correctly', () => {
    vi.mocked(useOutletContext).mockReturnValue({
      cart: mockCart,
      updateQuantity: vi.fn(),
      removeFromCart: vi.fn(),
    });
    render(<CartPage />);

    // subtotal = 56.99 * 2 = 113.98
    // tax = 113.98 * 0.13 = 14.8174 -> "$14.82"
    // total = 113.98 + 14.8174 = 128.7974 -> "$128.80"
    expect(screen.getAllByText(/\$113\.98/)).toHaveLength(2);
    expect(screen.getByText(/\$14\.82/)).toBeInTheDocument();
    expect(screen.getByText(/\$128\.80/)).toBeInTheDocument();
  });

  it('should show empty cart message when cart is empty', () => {
    vi.mocked(useOutletContext).mockReturnValue({
      cart: [],
      updateQuantity: vi.fn(),
      removeFromCart: vi.fn(),
    });
    render(<CartPage />);

    expect(screen.getByText(/cart is empty/)).toBeInTheDocument();
  });
});
