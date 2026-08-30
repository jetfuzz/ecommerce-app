import type { Product } from '../types';

export function createMockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    title: 'Product',
    price: 0,
    description: '',
    category: 'misc',
    image: '/image.png',
    rating: { rate: 0, count: 0 },
    ...overrides,
  };
}
