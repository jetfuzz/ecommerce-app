import type { Product } from '../types';

export function createMockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    title: 'Product',
    price: 0,
    description: '',
    categoryName: 'misc',
    image: '/image.png',
    stock: 0,
    ...overrides,
  };
}
