import { describe, expect, it, vi } from 'vitest';
import ShopPage from './ShopPage';
import { render, screen } from '@testing-library/react';
import { useOutletContext } from 'react-router';
import type { Product } from '../../types';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { createMockProduct } from '../../tests/mocks';

const mockProducts: Product[] = [
  createMockProduct({
    id: 1,
    title: 'Backpack',
    price: 109.95,
    category: "men's clothing",
  }),
  createMockProduct({
    id: 2,
    title: 'T-Shirt',
    price: 22.3,
    category: "men's clothing",
  }),
  createMockProduct({
    id: 3,
    title: 'Gold Necklace',
    price: 695.0,
    category: 'jewelery',
  }),
  createMockProduct({
    id: 4,
    title: 'Snowboard Jacket',
    price: 56.99,
    category: "women's clothing",
  }),
];

vi.mock('react-router', () => ({
  useOutletContext: vi.fn(),
}));

vi.mock('../../components/ItemCard/ItemCard', () => ({
  default: ({ product }: { product: Product }) => (
    <div data-testid="mock-item-card">{product.title}</div>
  ),
}));

describe('ShopPage', () => {
  it('should display all products when no filters are applied', () => {
    vi.mocked(useOutletContext).mockReturnValue({
      products: mockProducts,
      searchQuery: '',
    });
    render(<ShopPage />);

    expect(screen.getByText('Backpack')).toBeInTheDocument();
    expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('Gold Necklace')).toBeInTheDocument();
    expect(screen.getByText('Snowboard Jacket')).toBeInTheDocument();
  });

  it('should filter by category', async () => {
    vi.mocked(useOutletContext).mockReturnValue({
      products: mockProducts,
      searchQuery: '',
    });
    const user = userEvent.setup();
    render(<ShopPage />);

    await user.click(screen.getByRole('checkbox', { name: 'jewelery' }));

    expect(screen.getByText('Gold Necklace')).toBeInTheDocument();
    expect(screen.queryByText('Backpack')).not.toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: 'jewelery' }));

    expect(screen.getByText('Backpack')).toBeInTheDocument();
  });

  it('should filter multiple categories', async () => {
    vi.mocked(useOutletContext).mockReturnValue({
      products: mockProducts,
      searchQuery: '',
    });
    const user = userEvent.setup();
    render(<ShopPage />);

    await user.click(screen.getByRole('checkbox', { name: 'jewelery' }));
    await user.click(
      screen.getByRole('checkbox', { name: "women's clothing" }),
    );

    expect(screen.getByText('Gold Necklace')).toBeInTheDocument();
    expect(screen.getByText('Snowboard Jacket')).toBeInTheDocument();
    expect(screen.queryByText('Backpack')).not.toBeInTheDocument();
  });

  it('should filter by search and category', async () => {
    vi.mocked(useOutletContext).mockReturnValue({
      products: mockProducts,
      searchQuery: 'shirt',
    });
    const user = userEvent.setup();
    render(<ShopPage />);

    await user.click(screen.getByRole('checkbox', { name: "men's clothing" }));

    expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    expect(screen.queryByText('Backpack')).not.toBeInTheDocument();
  });

  it('should display "No results." when search query does not match any products', () => {
    vi.mocked(useOutletContext).mockReturnValue({
      products: mockProducts,
      searchQuery: 'asdfasdfa',
    });
    render(<ShopPage />);

    expect(screen.getByText('No results.')).toBeInTheDocument();
  });
});
