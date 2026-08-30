import { describe, expect, it } from 'vitest';
import type { Product } from '../types';
import { createMockProduct } from '../tests/mocks';
import { act, renderHook } from '@testing-library/react';
import { useCart } from './useCart';

const mockProduct: Product = createMockProduct({ id: 1 });

describe('useCart', () => {
  it('should add to cart with correct quantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cart).toEqual([
      { product: mockProduct, quantity: 1 },
    ]);

    act(() => {
      result.current.addToCart(mockProduct, 3);
    });

    expect(result.current.cart).toEqual([
      { product: mockProduct, quantity: 4 },
    ]);
  });

  it('should remove a product from cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.removeFromCart(1);
    });

    expect(result.current.cart).toEqual([]);
  });

  it('should update a products quantity correctly', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.updateQuantity(1, 3);
    });

    expect(result.current.cart).toEqual([
      { product: mockProduct, quantity: 3 },
    ]);
  });

  it('should prevent updating quantity below 1', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.updateQuantity(1, 0);
      result.current.updateQuantity(1, -100);
    });

    expect(result.current.cart).toEqual([
      { product: mockProduct, quantity: 1 },
    ]);
  });

  it('should return the correct cart item count', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.addToCart(createMockProduct({ id: 2 }), 3);
    });

    expect(result.current.cartItemCount).toEqual(5);
    expect(result.current.cart.length).toEqual(2);
  });
});
