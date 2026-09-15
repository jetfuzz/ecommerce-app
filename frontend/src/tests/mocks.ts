import type { Cart, CartItem, Product } from '../types';

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

export function createMockCartItem(
  overrides: Partial<CartItem> = {},
): CartItem {
  return {
    id: 1,
    productId: 1,
    productTitle: 'Product',
    productImage: '/image.png',
    productCategoryName: 'misc',
    productPrice: 10,
    quantity: 1,
    ...overrides,
  };
}

export function createMockCart(overrides: Partial<Cart> = {}): Cart {
  const items = overrides.items ?? [createMockCartItem()];
  return {
    items,
    subtotal: items.reduce((sum, i) => sum + i.productPrice * i.quantity, 0),
    totalItemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    ...overrides,
  };
}
