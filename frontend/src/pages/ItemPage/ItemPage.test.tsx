import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockProduct } from '../../tests/mocks';
import { render, screen } from '@testing-library/react';
import ItemPage from './ItemPage';
import type { Product } from '../../types';
import { useParams } from 'react-router';
import userEvent from '@testing-library/user-event';
import { useCartContext } from '../../context/CartContext';
import { useProduct } from '../../hooks/useProduct';

const mockProduct: Product = createMockProduct({ id: 1, stock: 10 });

vi.mock('../../hooks/useProduct', () => ({
  useProduct: vi.fn(),
}));

vi.mock('react-router', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('../../context/CartContext', () => ({
  useCartContext: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(useCartContext).mockReturnValue({
    addToCart: vi.fn(),
    cartState: { status: 'idle' },
    isMutating: false,
    updateQuantity: vi.fn(),
    removeFromCart: vi.fn(),
  });
});

describe('ItemPage', () => {
  it('should display "Product not found." when id is missing', () => {
    vi.mocked(useParams).mockReturnValue({});
    render(<ItemPage />);

    expect(screen.getByText('Product not found.')).toBeInTheDocument();
  });

  it('should display an error message when the product fetch fails', () => {
    vi.mocked(useParams).mockReturnValue({ id: '99999' });
    vi.mocked(useProduct).mockReturnValue({
      status: 'error',
      message: 'Product not found',
    });
    render(<ItemPage />);

    expect(screen.getByText('Product not found')).toBeInTheDocument();
  });

  it('should not allow quantity to decrement below 1', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(useProduct).mockReturnValue({
      status: 'success',
      data: mockProduct,
    });
    const user = userEvent.setup();
    render(<ItemPage />);

    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }));
    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }));
    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }));

    expect(screen.getByRole('spinbutton')).toHaveValue(1);
    expect(screen.getByRole('button', { name: 'Decrease quantity' })).toBeDisabled();
  });

  it('should call addToCart with the correct quantity', async () => {
    const addToCart = vi.fn();
    vi.mocked(useCartContext).mockReturnValue({
      addToCart,
      cartState: { status: 'idle' },
      isMutating: false,
      updateQuantity: vi.fn(),
      removeFromCart: vi.fn(),
    });

    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(useProduct).mockReturnValue({
      status: 'success',
      data: mockProduct,
    });
    const user = userEvent.setup();
    render(<ItemPage />);

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }));
    await user.click(screen.getByRole('button', { name: 'Add to Cart' }));

    expect(addToCart).toHaveBeenCalledWith(mockProduct.id, 2);
  });

  it('should display loading state', () => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(useProduct).mockReturnValue({ status: 'loading' });

    render(<ItemPage />);

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should disable button and show "Out of Stock" when stock is 0', () => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(useProduct).mockReturnValue({
      status: 'success',
      data: createMockProduct({ id: 1, stock: 0 }),
    });
    render(<ItemPage />);

    expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeDisabled();
  });

  it('should show a low stock message', () => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(useProduct).mockReturnValue({
      status: 'success',
      data: createMockProduct({ id: 1, stock: 3 }),
    });
    render(<ItemPage />);

    expect(screen.getByText('Only 3 left in stock')).toBeInTheDocument();
  });

  it('should not allow quantity above stock', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(useProduct).mockReturnValue({
      status: 'success',
      data: createMockProduct({ id: 1, stock: 2 }),
    });
    const user = userEvent.setup();
    render(<ItemPage />);

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));

    expect(screen.getByRole('spinbutton')).toHaveValue(2);
    expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeDisabled();
  });
});
