import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '../context/AuthContext';
import type { AuthContextType, Cart } from '../types';
import {
  addCartItem,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from '../api/cart';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useCart } from './useCart';
import { createMockCart } from '../tests/mocks';

vi.mock('../api/cart');
vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));

const mockCart: Cart = createMockCart();

describe('effect hook', () => {
  it('should have a state of "idle" when !isAuthenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
    } as AuthContextType);

    const { result } = renderHook(() => useCart());

    expect(result.current.cartState.status).toBe('idle');
    expect(fetchCart).not.toHaveBeenCalled();
  });

  it('should have an initial state of "loading" when isAuthenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
    } as AuthContextType);
    vi.mocked(fetchCart).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useCart());

    expect(result.current.cartState.status).toBe('loading');
  });

  it('should return data and "success" status on successful response', async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
    } as AuthContextType);
    vi.mocked(fetchCart).mockResolvedValue(mockCart);
    const { result } = renderHook(() => useCart());

    await waitFor(() =>
      expect(result.current.cartState.status).toBe('success'),
    );
    if (result.current.cartState.status !== 'success')
      throw new Error('unreachable');

    expect(result.current.cartState.data).toEqual(mockCart);
  });

  it('should display error message on failed response', async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
    } as AuthContextType);
    vi.mocked(fetchCart).mockRejectedValue(new Error('Network down'));
    const { result } = renderHook(() => useCart());

    await waitFor(() => expect(result.current.cartState.status).toBe('error'));

    if (result.current.cartState.status !== 'error')
      throw new Error('unreachable');

    expect(result.current.cartState.message).toBe('Network down');
  });

  it('should display fallback error message on failed response and non-error message', async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
    } as AuthContextType);
    vi.mocked(fetchCart).mockRejectedValue({ status: 500 });
    const { result } = renderHook(() => useCart());

    await waitFor(() => expect(result.current.cartState.status).toBe('error'));

    if (result.current.cartState.status !== 'error')
      throw new Error('unreachable');

    expect(result.current.cartState.message).toBe('Something went wrong');
  });
});

describe('addToCart', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
    } as AuthContextType);
    vi.mocked(fetchCart).mockResolvedValue(createMockCart());
  });

  it('should return data and "success" status on success', async () => {
    const { result } = renderHook(() => useCart());
    await waitFor(() =>
      expect(result.current.cartState.status).toBe('success'),
    );

    const updatedCart = createMockCart({ totalItemCount: 5 });
    vi.mocked(addCartItem).mockResolvedValue(updatedCart);

    await act(async () => {
      await result.current.addToCart(1, 2);
    });

    expect(addCartItem).toHaveBeenCalledWith(1, 2);
    expect(result.current.cartState).toEqual({
      status: 'success',
      data: updatedCart,
    });
  });

  it('should display error message on failed response', async () => {
    const { result } = renderHook(() => useCart());
    await waitFor(() =>
      expect(result.current.cartState.status).toBe('success'),
    );

    vi.mocked(addCartItem).mockRejectedValue(new Error('Out of stock'));

    await act(async () => {
      await result.current.addToCart(1, 2);
    });

    expect(result.current.cartState).toEqual({
      status: 'error',
      message: 'Out of stock',
    });
  });

  it('should display fallback error message on failed response and non-error message', async () => {
    const { result } = renderHook(() => useCart());
    await waitFor(() =>
      expect(result.current.cartState.status).toBe('success'),
    );

    vi.mocked(addCartItem).mockRejectedValue({ status: 500 });

    await act(async () => {
      await result.current.addToCart(1, 2);
    });

    expect(result.current.cartState).toEqual({
      status: 'error',
      message: 'Something went wrong',
    });
  });
});

describe('updateQuantity', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
    } as AuthContextType);
    vi.mocked(fetchCart).mockResolvedValue(createMockCart());
  });

  it('should return data and "success" status on success', async () => {
    const { result } = renderHook(() => useCart());
    await waitFor(() =>
      expect(result.current.cartState.status).toBe('success'),
    );

    const updatedCart = createMockCart({ totalItemCount: 5 });
    vi.mocked(updateCartItem).mockResolvedValue(updatedCart);

    await act(async () => {
      await result.current.updateQuantity(1, 2);
    });

    expect(updateCartItem).toHaveBeenCalledWith(1, 2);
    expect(result.current.cartState).toEqual({
      status: 'success',
      data: updatedCart,
    });
  });

  it('should display error message on failed response', async () => {
    const { result } = renderHook(() => useCart());
    await waitFor(() =>
      expect(result.current.cartState.status).toBe('success'),
    );

    vi.mocked(updateCartItem).mockRejectedValue(new Error('Out of stock'));

    await act(async () => {
      await result.current.updateQuantity(1, 2);
    });

    expect(result.current.cartState).toEqual({
      status: 'error',
      message: 'Out of stock',
    });
  });

  it('should display fallback error message on failed response and non-error message', async () => {
    const { result } = renderHook(() => useCart());
    await waitFor(() =>
      expect(result.current.cartState.status).toBe('success'),
    );

    vi.mocked(updateCartItem).mockRejectedValue({ status: 500 });

    await act(async () => {
      await result.current.updateQuantity(1, 2);
    });

    expect(result.current.cartState).toEqual({
      status: 'error',
      message: 'Something went wrong',
    });
  });
});

describe('removeFromCart', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
    } as AuthContextType);
    vi.mocked(fetchCart).mockResolvedValue(createMockCart());
  });

  it('should return data and "success" status on success', async () => {
    const { result } = renderHook(() => useCart());
    await waitFor(() =>
      expect(result.current.cartState.status).toBe('success'),
    );

    const updatedCart = createMockCart({ totalItemCount: 5 });
    vi.mocked(removeCartItem).mockResolvedValue(updatedCart);

    await act(async () => {
      await result.current.removeFromCart(1);
    });

    expect(removeCartItem).toHaveBeenCalledWith(1);
    expect(result.current.cartState).toEqual({
      status: 'success',
      data: updatedCart,
    });
  });

  it('should display error message on failed response', async () => {
    const { result } = renderHook(() => useCart());
    await waitFor(() =>
      expect(result.current.cartState.status).toBe('success'),
    );

    vi.mocked(removeCartItem).mockRejectedValue(new Error('Out of stock'));

    await act(async () => {
      await result.current.removeFromCart(1);
    });

    expect(result.current.cartState).toEqual({
      status: 'error',
      message: 'Out of stock',
    });
  });

  it('should display fallback error message on failed response and non-error message', async () => {
    const { result } = renderHook(() => useCart());
    await waitFor(() =>
      expect(result.current.cartState.status).toBe('success'),
    );

    vi.mocked(removeCartItem).mockRejectedValue({ status: 500 });

    await act(async () => {
      await result.current.removeFromCart(1);
    });

    expect(result.current.cartState).toEqual({
      status: 'error',
      message: 'Something went wrong',
    });
  });
});
