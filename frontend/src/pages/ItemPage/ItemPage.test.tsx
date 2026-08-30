import { describe, expect, it, vi } from 'vitest';
import { createMockProduct } from '../../tests/mocks';
import { render, screen } from '@testing-library/react';
import ItemPage from './ItemPage';
import type { Product } from '../../types';
import { useOutletContext, useParams } from 'react-router';
import userEvent from '@testing-library/user-event';

const mockProducts: Product[] = [createMockProduct({ id: 1 })];

vi.mock('react-router', () => ({
  useOutletContext: vi.fn(),
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

describe('ItemPage', () => {
  it('should display "Product not found." when id is missing', () => {
    vi.mocked(useParams).mockReturnValue({});
    vi.mocked(useOutletContext).mockReturnValue({
      products: mockProducts,
      addToCart: vi.fn(),
    });
    render(<ItemPage />);

    expect(screen.getByText('Product not found.')).toBeInTheDocument();
  });

  it('should display "Product not found." when id doesnt match product', () => {
    vi.mocked(useParams).mockReturnValue({ id: '99999' });
    vi.mocked(useOutletContext).mockReturnValue({
      products: mockProducts,
      addToCart: vi.fn(),
    });
    render(<ItemPage />);

    expect(screen.getByText('Product not found.')).toBeInTheDocument();
  });

  it('should not allow quantity to decrement below 1', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(useOutletContext).mockReturnValue({
      products: mockProducts,
      addToCart: vi.fn(),
    });
    const user = userEvent.setup();
    render(<ItemPage />);

    await user.click(screen.getByRole('button', { name: '-' }));
    await user.click(screen.getByRole('button', { name: '-' }));
    await user.click(screen.getByRole('button', { name: '-' }));

    expect(screen.getByRole('spinbutton')).toHaveValue(1);
  });

  it('should call addToCart with the correct quantity', async () => {
    const addToCart = vi.fn();
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(useOutletContext).mockReturnValue({
      products: mockProducts,
      addToCart,
    });
    const user = userEvent.setup();
    render(<ItemPage />);

    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '-' }));
    await user.click(screen.getByRole('button', { name: 'Add to cart' }));

    expect(addToCart).toHaveBeenCalledWith(mockProducts[0], 2);
  });
});
