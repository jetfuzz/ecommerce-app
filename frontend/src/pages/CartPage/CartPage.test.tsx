import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CartPage from './CartPage';
import { useCartContext } from '../../context/CartContext';
import type { Cart } from '../../types';
import { createMockCart, createMockCartItem } from '../../tests/mocks';
import { createCheckoutSession } from '../../api/checkout';

const mockCart: Cart = createMockCart({
  items: [createMockCartItem({ id: 1, quantity: 1 })],
});

vi.mock('../../context/CartContext', () => ({
  useCartContext: vi.fn(),
}));

vi.mock('../../api/checkout', () => ({
  createCheckoutSession: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(useCartContext).mockReturnValue({
    cartState: { status: 'success', data: mockCart },
    updateQuantity: vi.fn(),
    removeFromCart: vi.fn(),
    addToCart: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('CartPage', () => {
  it('disables decrement button when item quantity is 1', () => {
    render(<CartPage />);

    expect(screen.getByRole('button', { name: '-' })).toBeDisabled();
  });

  it('calls updateQuantity with correct values', async () => {
    const updateQuantity = vi.fn();
    vi.mocked(useCartContext).mockReturnValue({
      cartState: {
        status: 'success',
        data: createMockCart({
          items: [createMockCartItem({ id: 1, quantity: 2 })],
        }),
      },
      updateQuantity,
      removeFromCart: vi.fn(),
      addToCart: vi.fn(),
    });
    const user = userEvent.setup();
    render(<CartPage />);

    await user.click(screen.getByRole('button', { name: '+' }));
    expect(updateQuantity).toHaveBeenCalledWith(1, 3);
    await user.click(screen.getByRole('button', { name: '-' }));
    expect(updateQuantity).toHaveBeenCalledWith(1, 1);
  });

  it('calls removeFromCart with the correct item id', async () => {
    const removeFromCart = vi.fn();
    vi.mocked(useCartContext).mockReturnValue({
      cartState: { status: 'success', data: mockCart },
      updateQuantity: vi.fn(),
      removeFromCart,
      addToCart: vi.fn(),
    });
    const user = userEvent.setup();
    render(<CartPage />);

    await user.click(
      screen.getByRole('button', { name: 'Remove item from cart' }),
    );
    expect(removeFromCart).toHaveBeenCalledWith(1);
  });

  it('redirects to the checkout session URL on success', async () => {
    vi.mocked(createCheckoutSession).mockResolvedValue({
      url: 'https://checkout.example.com/session',
    });
    vi.stubGlobal('location', { href: '' });

    const user = userEvent.setup();
    render(<CartPage />);

    await user.click(screen.getByRole('button', { name: 'Checkout' }));

    await waitFor(() => {
      expect(window.location.href).toBe('https://checkout.example.com/session');
    });
  });

  it('shows an error and re-enables checkout button when checkout fails', async () => {
    vi.mocked(createCheckoutSession).mockRejectedValue(new Error('failed'));

    const user = userEvent.setup();
    render(<CartPage />);

    await user.click(screen.getByRole('button', { name: 'Checkout' }));

    await waitFor(() => {
      expect(
        screen.getByText(
          'Something went wrong starting checkout. Please try again.',
        ),
      ).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Checkout' })).not.toBeDisabled();
  });
});
